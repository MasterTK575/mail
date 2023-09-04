document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  // submit button to send an email
  document.querySelector('#compose-form').addEventListener('submit', event => {
    event.preventDefault();
    console.log("Form submission prevented");
    submit_email();
  });


  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  // get and show all mailbox emails
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.log(emails);
      
      
      
      emails_view = document.querySelector('#emails-view')
      // if no emails yet
      if(emails.length === 0) {
        emails_view.innerHTML += '<div class="alert alert-primary" role="alert">No emails to display.</div>';
        return;
      }
      // else add emails to the emails-view
      emails.forEach(element => {
        // create the container for the email banner
        const email_box = document.createElement('button');
        email_box.classList.add("d-flex", "list-group-item", "list-group-item-action");
        email_box.setAttribute("type", "button");
        // create and fill the parts of the email banner
        const email_sender = document.createElement('div');
        const email_subject = document.createElement('div');
        const email_timestamp = document.createElement('div');
        email_sender.innerHTML = element.sender;
        email_sender.classList.add("mr-4");
        email_subject.innerHTML = element.subject;
        email_timestamp.innerHTML = element.timestamp;
        email_timestamp.classList.add("ml-auto");
        // append all together
        email_box.appendChild(email_sender);
        email_box.appendChild(email_subject);
        email_box.appendChild(email_timestamp);
        emails_view.appendChild(email_box);
      });
  });
}

function submit_email() {
  const alert = document.createElement('div');
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value
    })
  })
  .then(response => response.json())
  .then(result => {
    if (result.error) {
      // show error alert if there is an error
      showAlert(result.error, 'danger');
      // compose_email(); --> if you want to clear the form
    } else {
      // else go to sent
      console.log(result.message);
      showAlert(result.message, 'success');
      load_mailbox('sent');
  }
  });
}

function showAlert(message, type) {
  const alertDiv = document.querySelector('#alert-message');
  alertDiv.style.display = 'block';
  alertDiv.classList.add(`alert-${type}`);
  alertDiv.innerHTML = message;

  // hide alert after 10 seconds
  setTimeout(() => {
    alertDiv.style.display = 'none';
  }, 5000);
}