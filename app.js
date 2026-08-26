async function sendOTP() {
  const email = document.getElementById('email').value;
  const messageEl = document.getElementById('message');
  messageEl.innerText = 'Sending OTP...';

  try {
    // Pass both userId and email here:
    const response = await account.createEmailToken({
      userId: ID.unique(),
      email: email // <-- Make sure email is included here
    });

    currentUserId = response.userId;
    messageEl.innerText = '';
    
    document.getElementById('request-section').style.display = 'none';
    document.getElementById('verify-section').style.display = 'block';
  } catch (error) {
    messageEl.innerText = 'Error: ' + error.message;
  }
}s