function hulkappsDoActions(t) {
    "object" == typeof t.discounts && "object" == typeof t.discounts.cart && "object" == typeof t.discounts.cart.items && hulkappsShowCartDiscounts(t.discounts)
}

function hulkappsShowCartDiscounts(t) {
    window.hulkapps.discounts = t;
    var a = 0;
    t.cart.items.forEach(function(t) {
        t.discounted_price < t.original_price ? (a = 1, jQuery(".hulkapps-cart-item-price[data-key='" + t.key + "']").html("<span class='original_price' style='text-decoration:line-through;'>" + t.original_price_format + "</span><br/><span class='discounted_price'>" + t.discounted_price_format + "</span>"), jQuery(".hulkapps-cart-item-line-price[data-key='" + t.key + "']").html("<span class='original_price' style='text-decoration:line-through;'>" + t.original_line_price_format + "</span><br/><span class='discounted_price'>" + t.discounted_line_price_format + "</span>")) : (jQuery(".hulkapps-cart-item-price[data-key='" + t.key + "']").html("<span class='original_price'>" + t.original_price_format + "</span>"), jQuery(".hulkapps-cart-item-line-price[data-key='" + t.key + "']").html("<span class='original_price'>" + t.original_line_price_format + "</span>"))
    }), 1 == a ? (jQuery(".hulkapps-cart-original-total").html(t.original_price_total).css("text-decoration", "line-through"), jQuery("<span class='hulkapps-cart-total'>" + t.discounted_price_total + "</span>").insertAfter(".hulkapps-cart-original-total"), jQuery(".hulkapps-header-cart-total").html(t.discounted_price_total)) : (jQuery(".hulkapps-cart-original-total").html(t.original_price_total), jQuery(".hulkapps-header-cart-total").html(t.original_price_total));
    ["input[name='checkout']", "button[name='checkout']", "[href$='checkout']", "input[name='goto_pp']", "button[name='goto_pp']", "input[name='goto_gc']", "button[name='goto_gc']", ".additional-checkout-button", ".google-wallet-button-holder", ".amazon-payments-pay-button"].forEach(function(t) {
        var a = document.querySelectorAll(t);
        if ("object" == typeof a && a)
            for (var o = 0; o < a.length; o++) {
                var e = a[o];
                if ("function" != typeof e.addEventListener) return;
                e.addEventListener("click", function(t) {
                    var a = document.getElementById("hulkapps-use-discount-code-instead-check");
                    if ("object" == typeof a && a && a.checked) return !0;
                    t.preventDefault(), $.ajax({
                        type: "POST",
                        url: "/cart.js",
                        data: $(this).parents('form[action="/cart"]').serialize(),
                        dataType: "json",
                        success: function(t) {
                            window.hulkapps.cart = t, hulkappsCheckout()
                        }
                    })
                }, !1), e.dataset.hulkapps = !0, e.dataset.ocuCheckout = !0
            }
    })
}

function hulkappsCheckout() {
    for (var t = 0; t < window.hulkapps.cart.items.length; t++) {
        var a = window.hulkapps.cart.items[t],
            o = document.querySelectorAll("[id='updates_" + a.key + "']");
        1 != o.length && (o = document.querySelectorAll("[id='updates_" + a.variant_id + "']")), 1 == o.length && (window.hulkapps.cart.items[t].quantity = o[0].value)
    }
    var e = "https://volumediscount.hulkapps.com/shop/create_draft_order";
    "false" == window.hulkapps.is_volume_discount && (e = "https://productoption.hulkapps.com/store/create_draft_order"), $.ajax({
        type: "POST",
        url: e,
        data: {
            cart_json: JSON.stringify(window.hulkapps),
            store_id: window.hulkapps.store_id
        },
        crossDomain: !0,
        success: function(t) {
            window.location.href = "string" == typeof t ? t : "/checkout"
        }
    })
}

function hulkappsStart() {
    if (window.hulkappsc = {
            $cart_offers: jQuery(".hulkapps-cart-offers")
        }, setTimeout(function() {
            window.hulkappsc.$first_add_to_cart_el = null;
            var t = 0;
            if (["input[name='add']", "button[name='add']", "#add-to-cart", "#AddToCartText", "#AddToCart"].forEach(function(a) {
                    t += jQuery(a).length, null == window.hulkappsc.$first_add_to_cart_el && t && (window.hulkappsc.$first_add_to_cart_el = jQuery(a).first())
                }), 0 == jQuery(".hulkapps-summary").length && jQuery(".hulkapps-cart-total").length > 0 && jQuery('<div class="hulkapps-summary"></div>').insertBefore(".hulkapps-cart-total"), "product" == window.hulkapps.page_type && 0 == jQuery(".hulkapps-volumes").length && null != window.hulkappsc.$first_add_to_cart_el) {
                var a = window.hulkappsc.$first_add_to_cart_el;
                a.parent().is("div") && (a = a.parent()), a.after('<div class="hulkapps-volumes"></div>'), $.ajax({
                    type: "GET",
                    url: "https://volumediscount.hulkapps.com/shop/get_offer_table",
                    data: {
                        pid: window.hulkapps.product_id,
                        store_id: window.hulkapps.store_id
                    },
                    crossDomain: !0,
                    success: function(t) {
                        $(".hulkapps-volumes").html(t)
                    }
                })
            }
            jQuery("body").on("change", 'input[name="updates[]"]', function(t) {
                jQuery('[name="update"]').click()
            })
        }, 1), "cart" == window.hulkapps.page_type) {
        var t = "";
        "true" == window.hulkapps.is_volume_discount ? t = "https://volumediscount.hulkapps.com/shop/get_cart_details" : "true" == window.hulkapps.is_product_option && (t = "https://productoption.hulkapps.com/store/get_cart_details"), "" != t && $.ajax({
            type: "POST",
            url: t,
            data: {
                cart_data: JSON.stringify(window.hulkapps),
                store_id: window.hulkapps.store_id
            },
            crossDomain: !0,
            success: function(t) {
                setTimeout(function() {
                    hulkappsDoActions(t)
                }, 1)
            }
        })
    }
}
$.ajax({
    type: "GET",
    url: "https://volumediscount.hulkapps.com/shop/is_installed",
    data: {
        store_id: window.hulkapps.store_id
    },
    crossDomain: !0,
    success: function(t) {
        window.hulkapps.is_volume_discount = t, $.ajax({
            type: "GET",
            url: "https://productoption.hulkapps.com/shop/is_installed",
            data: {
                store_id: window.hulkapps.store_id
            },
            crossDomain: !0,
            success: function(t) {
                window.hulkapps.is_product_option = t, hulkappsStart()
            }
        })
    }
});
