import { Outlet } from "@remix-run/react";

export default function Layout() {
  return (
    <article className={ "signup" }>
      <Outlet />
    </article>
  );
}