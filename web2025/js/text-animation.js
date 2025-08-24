document.addEventListener('DOMContentLoaded', function() {
    const textElement =document.getElementById('animatedText');
    const text = "kaixo people, beitu que guay";
    let index = 0;

    function animateText() {
        if (index < text.length) {
            textElement.innerHTML += text[index];
            index++;
            setTimeout(animateText, 100); // Adjust the speed here (in milliseconds)
        }
    }

    animateText();
});
