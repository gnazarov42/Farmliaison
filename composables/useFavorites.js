export function useFavorites() {
  const favorites = useState('favorites', () => []);
  const favoritesFetched = useState('favoritesFetched', () => false);
  const { status } = useAuth();

  const fetchFavorites = async () => {
    if (status.value === 'authenticated' && !favoritesFetched.value) {
      try {
        favoritesFetched.value = true;
        const response = await $fetch('/api/favorites/get');
        // Ensure we are assigning the response body to favorites.value
        if (response.statusCode === 200 && Array.isArray(response.body)) {
          favorites.value = response.body;
        } else {
          favorites.value = [];
        }
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
      }
    }
  };

  const addFavorite = async (farmId, eventId) => {
    try {
      await $fetch('/api/favorites/add', {
        method: 'POST',
        body: {
          farmId,
          eventId,
        },
      });
      // favorites.value = [...favorites.value, { farmId, eventId }];
      favoritesFetched.value = false;
    } catch (error) {
      console.error('Failed to add favorite:', error);
    }
  };

  const removeFavorite = async (farmId, eventId) => {
    try {
      await $fetch('/api/favorites/remove', {
        method: 'POST',
        body: {
          farmId,
          eventId,
        },
      });
      // favorites.value = favorites.value.filter(
      //   (fav) => fav.farmId !== farmId && fav.eventId !== eventId,
      // );
      favoritesFetched.value = false;
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  // Fetch favorites when the composable is first used
  onMounted(() => {
    fetchFavorites();
  });

  return {
    favorites,
    fetchFavorites,
    addFavorite,
    removeFavorite,
  };
}
