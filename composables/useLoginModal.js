export const useLoginModal = () => {
  const showLoginModal = useState('showLoginModal', () => false);

  const openModal = () => {
    showLoginModal.value = true;
  };

  const closeModal = () => {
    showLoginModal.value = false;
  };

  return {
    showLoginModal,
    openModal,
    closeModal,
  };
};
