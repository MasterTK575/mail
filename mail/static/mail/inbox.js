document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  // submit button to send an email
  document.querySelector('#compose-form').addEventListener('submit', event => {
    event.preventDefault();
    submit_email();
  });
  // buttons on the email view
  document.querySelector('#back').addEventListener('click', () => load_mailbox('inbox'));
  // TODO: add the other buttons


  // By default, load the inbox
  load_mailbox('inbox');
});

function mark_email() {
  // TODO
}
function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // add highlight for current page on navbar
  document.querySelector('#compose').classList.add("active");
  document.querySelector('#inbox').classList.remove("active");
  document.querySelector('#sent').classList.remove("active");
  document.querySelector('#archived').classList.remove("active");

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // add highlight for current page on navbar
  document.querySelector('#compose').classList.remove("active");
  document.querySelector('#inbox').classList.remove("active");
  document.querySelector('#sent').classList.remove("active");
  document.querySelector('#archived').classList.remove("active");
  if(mailbox === "inbox") {
    document.querySelector('#inbox').classList.add("active");
  } else if(mailbox === "sent"){
    document.querySelector('#sent').classList.add("active");
  } else {
    document.querySelector('#archived').classList.add("active");
  }

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
        // create the the elements for the email banner
        const email_box = document.createElement('button');
        const email_sender = document.createElement('div');
        const email_subject = document.createElement('div');
        const email_timestamp = document.createElement('div');

        // add stuff to them
        email_box.classList.add("d-flex", "list-group-item", "list-group-item-action");
        email_box.setAttribute("type", "button");
        // load the email if the box gets clicked
        email_box.addEventListener("click", () => load_email(element.id));
        email_sender.innerHTML = element.sender;
        email_sender.classList.add("mr-4");
        email_subject.innerHTML = element.subject;
        email_timestamp.innerHTML = element.timestamp;
        email_timestamp.classList.add("ml-auto");

        // differentiate between read and unread
        if(element.read === true) {
          email_box.style.backgroundColor = "#f5f5f5";
        } else {
          email_box.classList.add('border', 'border-secondary');
          email_sender.classList.add('font-weight-bold');
          email_subject.classList.add('font-weight-bold');
          email_timestamp.classList.add('font-weight-bold');
        }
        
        // append all together
        email_box.appendChild(email_sender);
        email_box.appendChild(email_subject);
        email_box.appendChild(email_timestamp);
        emails_view.appendChild(email_box);
      });
  });
}

function load_email(id) {
  // Show the email and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  // remove navbar highlighting
  document.querySelector('#compose').classList.remove("active");
  document.querySelector('#inbox').classList.remove("active");
  document.querySelector('#sent').classList.remove("active");
  document.querySelector('#archived').classList.remove("active");
  // get email contents via id and add them to the page
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
      console.log(email)
      // add email contents to page
      document.querySelector('#from').innerHTML = email.sender;
      document.querySelector('#to').innerHTML = email.recipients;
      document.querySelector('#subject').innerHTML = email.subject;
      document.querySelector('#timestamp').innerHTML = email.timestamp;
      document.querySelector('#content').innerHTML = email.body;
  });
  // mark the email as read
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })
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

  // hide alert after 5 seconds
  setTimeout(() => {
    alertDiv.style.display = 'none';
    alertDiv.classList.remove(`alert-${type}`);
  }, 5000);
}