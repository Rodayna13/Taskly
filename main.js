document.getElementById("loginbtn").addEventListener("click", function(event) {
    event.preventDefault(); 

    const emailInput = document.getElementById("email-input");
    const emailValue = emailInput.value;
    const passInput = document.getElementById("pass");
    const passValue = passInput.value ;
    let email = localStorage.getItem('email')
    let password = localStorage.getItem('password')
    
    if (email!=emailValue) {
        emailInput.style.borderColor = 'red';
        document.getElementById("alert").style.display = "block";
        document.getElementById("alert").innerHTML = "Invalid E-mail";

    }

    if (password!=passValue) {
        passInput.style.borderColor = 'red';
        document.getElementById("alert").style.display = "block";
        document.getElementById("alert").innerHTML = "Invalid Password";



    }
    
  

    if (emailValue == email && passValue == password) {
        location.href="./taskly/index.html";
    }
else {
            let alert = document.getElementById("alert")
            alert.classList.remove('d-none')
            alert.classList.remove('d-block')
}});

  

    
