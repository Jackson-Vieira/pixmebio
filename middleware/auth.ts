

export default defineNuxtRouteMiddleware(async (to) => {

  // TODO: MOVE THIS TO A COMPOSABLE useSession
  const user = useSupabaseUser();
  const hasUserLogged = Boolean(user.value)
  const isLogged = hasUserLogged

  if (!isLogged) {
    console.log("* user not authenticated");

    if (to.path === "/login") {
      return;
    }

    return navigateTo({ path: "/login" });
  }
});
