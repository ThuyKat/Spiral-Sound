# From Vanilla JS to React: What I Learned Migrating a Vinyl Store

Spiral Sounds started as a Scrimba Express.js follow-along project — an online vinyl record store with a plain HTML/JavaScript frontend and a Node.js/Express backend. I extended it by integrating Stripe for payments, then took on a more interesting challenge: migrating the frontend from vanilla HTML/JS to React.

Migrating code you already wrote and understand is one of the better ways to go deeper with React. You're not learning the syntax and the concepts at the same time — you already know what the code does, so you can focus entirely on *why* each React pattern exists. This is what that looked like.

---

## The original version

Each page was a separate HTML file loaded its own JS modules. State lived in the DOM. Navigation caused full page reloads. The patterns were familiar:

- Cart count updates required manually calling `updateCartIcon()` in every place that could affect it
- Showing/hiding the login and logout buttons required `showHideMenuItems()` — a function that directly toggled `element.style.display`
- Any change to the shared header or footer meant touching every HTML file

None of these are bugs, but they're all symptoms of the same root problem: **state is scattered and has to be manually synchronized**.

---

## Pages → components

The mapping is direct. Each HTML file becomes a page component, and React Router replaces file-based navigation. `window.location.href = '/cart.html'` becomes `navigate('/cart')`. `<a href="/login.html">` becomes `<Link to="/login">`.

The more meaningful difference is that only the page component swaps out on navigation — the rest of the component tree stays mounted, so state persists across the session without any extra work.

---

## Extracting shared UI

Every page shared the same banner, header, and footer. In the old app this was solved with copy-paste. In React, a `Layout` component wraps all routes via React Router's `<Outlet />`:

```
Layout
├── Banner
├── Header
├── <Outlet />   ← current page renders here
└── Footer
```

The Banner itself had three distinct responsibilities — a mobile menu toggle, auth-aware navigation links, and a cart icon — so it was broken into `Banner`, `Navigation`, and `CartIcon` components.

The toggle was the first real state decision: the button lives in `Banner`, and `Navigation` receives `isOpen` as a prop. The state lives in the closest common ancestor, which is the standard lift-state-up pattern. Straightforward.

---

## The custom hook trap

The cart count was where things got more interesting.

`CartIcon` in the banner needs to display the count. `ProductList` needs to refresh it after adding an item. Two components, one shared value — the obvious move is a custom hook:

```javascript
function useCartCount() {
  const [cartCount, setCartCount] = useState(0);
  const refresh = async () => { /* fetch /api/cart/cart-count */ };
  useEffect(() => { refresh(); }, []);
  return [cartCount, refresh];
}
```

If you call this hook in both components, it looks clean. It doesn't work.

The issue is obvious in hindsight: **each hook call is an independent instance**. `CartIcon` and `ProductList` each had their own isolated `cartCount` state. When `ProductList` called `refresh()`, it updated its own copy. `CartIcon` never knew anything changed.

The hook shared the logic. Not the state.

---

## Context as the fix

The solution is to own the state in a single Context provider and have both components consume from it:

```
CartContextProvider
├── Banner
│   └── CartIcon  ← reads cartCount
└── Home
    └── ProductList  ← calls refresh()
```

The custom hook still exists — but now it runs once inside `CartContextProvider`. Everything downstream reads from that one instance via `useContext`. When `ProductList` calls `refresh()`, it's the same function `CartIcon` is subscribed to.

The same pattern applied to auth. `Navigation` needs `isLoggedIn` to render the right links. `CartIcon` needs it to decide whether to render at all. Pulling both into an `AuthContext` replaced the old `showHideMenuItems()` with declarative rendering — components just read state and React handles the rest.

---

## Where login logic lives — and why it matters

The first version had the login fetch inside the `Login` component. It sent the request, and on success, called `navigate('/')`.

The problem: the `Login` component had no connection to `AuthContext`. After a successful login, `isLoggedIn` in the context hadn't changed. The banner still showed "Log in". The app looked broken until you refreshed.

The fix is to move `login()` and `logout()` out of the component and into `AuthContext` — so they have direct access to `setUser` and can update the shared state immediately on success.

This also revealed a cleaner separation of concerns. `useAuth` should only do one thing: check the session on mount and expose the user state. The actions — login, logout — belong in the context that owns that state:

- **`useAuth`** — runs `checkAuth` on mount, returns `{ user, setUser }`
- **`AuthContext`** — defines `login()` and `logout()`, uses `setUser` from the hook to update state, provides everything to the tree

This settled into a clear rule: **the hook manages state, the context owns actions, the component owns UI** — error messages, button disabled state, loading indicators. The `Login` component now just calls `login()` from context and reacts to the response.

---

## Session cookies vs localStorage

There are two common ways to handle auth persistence on the frontend.

**JWT + localStorage** — on login, the backend returns a token. The frontend stores it in `localStorage` and manually attaches it to every request as an `Authorization` header. It persists across refreshes, but the token is exposed to JavaScript, making it vulnerable to XSS attacks.

**Session cookies** — on login, the backend sets an `httpOnly` cookie. The browser stores it and attaches it automatically on every subsequent request to the same origin. Because `httpOnly` cookies are inaccessible to JavaScript, XSS can't steal them. The one thing you need on the frontend is `credentials: 'include'` on your fetch calls — by default, `fetch` does not send cookies. This option tells the browser to include them, so the backend can read the session and know who you are.

This app uses session cookies. The consequence for React state is that `isLoggedIn` doesn't survive a page refresh — it's just JavaScript in memory. On every mount, `useAuth` calls `/api/auth/me`. If the session cookie is still valid, the backend confirms the user and state is restored. If not, the user is logged out.

**React state reflects auth. The cookie owns it.** These are two separate things and keeping them separate is the right mental model.

---

## The actual takeaway

The migration made one thing very concrete: **vanilla JS treats the DOM as the source of truth; React treats state as the source of truth**.

In the old app, `showHideMenuItems()` existed because the DOM didn't know about login state — you had to reach in and update it manually every time something changed. In React, `isLoggedIn` changes once and everything that depends on it re-renders. The DOM is a side effect of state, not the thing you manage directly.

That shift — from imperative DOM manipulation to declarative state — is what every React pattern ultimately comes back to. Lifting state up, custom hooks, Context — each one is just a different answer to the same question: how far does this state need to reach?