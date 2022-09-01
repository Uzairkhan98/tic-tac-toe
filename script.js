[...document.getElementsByClassName("editImage")].forEach(e => {
    e.addEventListener("click", event => {
        let index = event.target.getAttribute('data-index')
        document.getElementById(`player${index}`).focus();
    })
});
