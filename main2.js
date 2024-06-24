document.getElementById("signUpbtn").addEventListener("click", function(event) {
   
    event.preventDefault(); 

    const emailInput = document.getElementById("email-input");
    const emailValue = emailInput.value;
    const fullNameInput = document.getElementById("name-input");
    const fullNameValue = fullNameInput.value;
   const fullNameRegX = /^[A-Za-z]+ [A-Za-z]+ [A-Za-z]+$/;
    const emailRegX = /^[a-zA-Z0-9]{3,}@(gmail|yahoo|outlook)\.com$/;
    const passRegx = /^.{4,}$/;
    const passInput = document.getElementById("pass");
    const passValue = passInput.value;
    
    function storeData() {
        localStorage.setItem('fullname', fullNameValue);
        localStorage.setItem('email', emailValue);
        localStorage.setItem('password', passValue);
    }

    if (!emailRegX.test(emailValue) || !fullNameRegX.test(fullNameValue) || !passRegx.test(passValue)) {
        if (!emailRegX.test(emailValue)) {
            emailInput.style.borderColor = 'red';
        }
        if (!fullNameRegX.test(fullNameValue)) {
            fullNameInput.style.borderColor = 'red';
        }
        if (!passRegx.test(passValue)) {
            passInput.style.borderColor = 'red';
        }
    } else {
        storeData();
        window.location.href = "index.html";
    }
    
});
