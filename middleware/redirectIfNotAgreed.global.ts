export default defineNuxtRouteMiddleware((to, from) => {
  const { data } = useAuth();
  const localePath = useLocalePath();

  if (
    data.value &&
    !data.value?.user?.agreedTerms &&
    to.path !== localePath('/welcome')
  ) {
    return navigateTo(localePath('/welcome'));
  }
  return;
});
