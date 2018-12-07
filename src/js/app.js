const ITEMS_PER_PAGE = 8;

const model = {
    products: [],
    currentPage: 1
};

const $search = $("input[name=search]");


$.getJSON("./data.json", data => {
    model.products = data;
    processPage(model.products, model.currentPage);
});

$search.on("keyup paste change", (event) => {
    let search = event.target.value;
    search = search.toLowerCase();
    let filteredproducts = model.products.filter((product) => {
        let name = product.name.toLowerCase();
        return name.includes(search);
    });
    currentPage = 1;
    processPage(filteredproducts, currentPage);
});

$("#clear-list").on("click", (ev) => {
    ev.preventDefault();
    $search.val("");
    currentPage = 1;
    processPage(model.products, model.currentPage);
});

function processPage(products, currentPage) {
    updateListItems(products, currentPage);
    createPagination(products, currentPage);
}

function updateListItems(productList, currentPage) {
    function getItem({image, name, price, oldPrice, id}) {
        return $(`<div class="col-md-3 itemProduct">  
            <div class="img-wrapper">
                <img src="${image}" alt="${name}">
            </div>
            <button class="removeItem">Remove from list</button>
            <div class="desc-item">
                <h2 class="title-item">${name}</h2>
                <p class="price-item">$${price}</p>
                <p class="old-price price-item"><s>${oldPrice ? "$" + oldPrice : ""}</s></p>
                <div class="icons-block">
                    <button class="icon delete-cart"><i class="fas fa-trash-alt"></i></button>
                    <button class="icon add-cart"><i class="fas fa-shopping-cart"></i></button>
                </div>
                <input type="hidden" name="custId" value=${id}>
            </div>
        </div>`);
    }

    const $container = $(".productsWrapper");
    let $list = $();
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    const endIndex = startIndex + ITEMS_PER_PAGE;
    productList.forEach((elem, i) => {
        if (i >= startIndex && i < endIndex) {
            const $item = getItem(elem);

            $list = $list.add($item);
        }
    });
    $container.empty().append($list);

    subscribeList();

}

function subscribeList() {
    $(".removeItem, .delete-cart").click(ev => {
        const $item = $(ev.target).closest(".itemProduct");
        const idItem = +$item.find("input:hidden").val();
        model.products = model.products.filter((elem) => {
            return elem.id !== idItem;
        });

        let maxPage = getMaxPage(model.products);
        if (model.currentPage > maxPage) {
            model.currentPage = maxPage;
        }

        processPage(model.products, model.currentPage);
    });
}


function createPagination(productList, currentPage) {
    function createPaginationItem(num) {
        let itemClass = "page-link num-link";
        if (num === currentPage) {
            itemClass+= " active";
        }
        return $(`<li class="page-item num-page">
                            <a class="${itemClass}" href="#">${num}</a>
                        </li>`)
    }

    const $pagContainer = $(".pagination");

    let $listPagination = $();
    const totalPage = getMaxPage(productList);
    for (let i = 1; i <= totalPage; i++) {
        const $itemPagination = createPaginationItem(i);
        $listPagination = $listPagination.add($itemPagination);
    }
    $pagContainer.empty().append($listPagination);

    $(".page-link").click(ev => {
        ev.preventDefault();
        currentPage = +ev.target.innerText;
        processPage(productList, currentPage);
    });
}

function getMaxPage(products)
{
    return Math.ceil(products.length / ITEMS_PER_PAGE);
}


$(function () {
    $(".advantages-slider").owlCarousel({
        loop: true,
        margin: 40,
        nav: false,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 3
            },
            1200: {
                items: 4
            }
        }
    });

    $("#burger-menu").click(function () {
        $(this).toggleClass("active");
        $(".menu").slideToggle();
    })

    $(".searchSite").click(function () {
        $(this).toggleClass("active");
        $(".hiddenSearch").slideToggle();
    })
});
