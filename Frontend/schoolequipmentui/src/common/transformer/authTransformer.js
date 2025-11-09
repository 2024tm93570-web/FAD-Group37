export const transformAuthResponse = (response) => {
    if (!response || !response.data) return {};
  
    const { token, user } = response.data;
  
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  };
  