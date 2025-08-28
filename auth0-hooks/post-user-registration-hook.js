exports.onExecutePostUserRegistration = async (event, api) => {
    console.log('User ID available:', event.user.user_id);
    
    try {
      const response = await fetch(
        `${event.secrets.APP_URL}/api/auth/sync-user`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${event.secrets.AUTH0_SECRET}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            auth0User: {
              user_id: event.user.user_id,
              email: event.user.email,
            }
          })
        }
      );
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Sanity sync failed: ${response.status} - ${errorText}`);
      }
  
      console.log('Sanity sync successful');
  
    } catch (error) {
      console.error('Post-registration sync failed:', error);
      // In post-registration, you can't deny access - user already exists
      // But you can throw to mark the action as failed for logging
      throw error;
    }
  };