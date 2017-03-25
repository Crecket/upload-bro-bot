module.exports = () => {
    var form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", "/login/telegram");
    document.body.appendChild(form);
    form.submit();
}