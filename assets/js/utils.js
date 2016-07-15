$(function() {
    $(".carousel-browse").each(function(index, carousel) {
        setCarousel($(carousel));
    });

    $("a.item-button.model").first().trigger("click");
});



function setCarousel(carousel) {
    var buttons = carousel.find(".item-button");
    var imgsFrame = carousel.find(".img-frame");
    var imgs = imgsFrame.find("img");

    carousel.owlCarousel({
        nav: true,
        dots: true,
        navText: [
                '<i class="fa fa-chevron-left" aria-hidden="true"></i>',
                '<i class="fa fa-chevron-right" aria-hidden="true"></i>'],
        rewind: true,
        responsive: {
                0: {items: 1,},
                768: {items: 2,},
                992: {items: 3,},},
    });
}

// Function to initiate fotorama and change thumbnail label
function initFotorama() {
    var f = $('.fotorama');
    f.fotorama();
    $('.fotorama').on(
        'fotorama:show',
        function (e, fotorama, extra) {
            try {
                $(".thumbnail-label").text(fotorama.activeFrame.label);
            }
            catch(e) {}
        }
    );
}
