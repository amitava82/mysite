$(function () {
  const RATE = 40;

  var headerHeight = $('.header-area').innerHeight();
  $(window).on('scroll', function() {
    var scroll = $(window).scrollTop(),
      header_area = $('.header-area');

    if (scroll > 1) {
      header_area.addClass("sticky-menu");
    } else {
      header_area.removeClass("sticky-menu");
    }
  });

  $('.counter').counterUp({
    delay: 10,
    time: 1000
  });

  $('ul#navigation').slicknav({
    prependTo: "#mobile_menu"
  });

  $(".owl-carousel").owlCarousel({
    items:1,
    loop:true,
    center: true,
    margin: 10,
    autoplay: true,
    dots: true,
  });

  $(window).on("scroll", function() {
    activeMenuItem($("#nav_mobile_menu"));
  });

  $('#contact-form').on('submit', function(e) {
    e.preventDefault();
    const captchaResp = grecaptcha.getResponse();
    console.log(captchaResp);

    if(captchaResp.length === 0) {
      $('.captcha-error').text('Please verify that you are a human!');
      return;
    } else {
      $('.captcha-error').text('');
    }

    var data = $(this).serializeArray();



    $(e.target).attr('disabled', true);
    var action = $(this).attr("action");
    $.ajax({
      type: "POST",
      url: action,
      contentType: 'application/json',
      data: JSON.stringify(getFormData(data))
    }).then(function () {
      $('.form-submit').html(
        `<div class="alert alert-success">Thank you! Your message has been received.</div>`
      );
    }).catch(
      (e) => {
        console.log(e);
        $('.captcha-error').text(e.message);
      }
    )
  });

  function getFormData(data) {
    var unindexed_array = data;
    var indexed_array = {};

    $.map(unindexed_array, function(n, i) {
      indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
  }

  //function for active menuitem
  function activeMenuItem($links) {
    var top = $(window).scrollTop(),
      windowHeight = $(window).height(),
      documentHeight = $(document).height(),
      cur_pos = top + 2,
      sections = $("section"),
      nav = $links,
      nav_height = nav.outerHeight(),
      home = nav.find(" > ul > li:first");

    sections.each(function() {
      var top = $(this).offset().top - nav_height - 40,
        bottom = top + $(this).outerHeight();

      if (cur_pos >= top && cur_pos <= bottom) {
        nav.find("> ul > li > a").parent().removeClass("active");
        nav.find("a[href='#" + $(this).attr('id') + "']").parent().addClass("active");
      } else if (cur_pos === 2) {
        nav.find("> ul > li > a").parent().removeClass("active");
        home.addClass("active");
      } else if ($(window).scrollTop() + windowHeight > documentHeight - 400) {
        nav.find("> ul > li > a").parent().removeClass("active");
      }
    });
  }

  function smoothScrolling($links, $topGap) {
    var links = $links;
    var topGap = $topGap;

    links.on("click", function() {
      if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
        if (target.length) {
          $("html, body").animate({
            scrollTop: target.offset().top - topGap
          }, 350);
          return false;
        }
      }
      return false;
    });
  }

  $(window).on("load", function() {
    smoothScrolling($("a.scroll-btn[href^='#']"), 0);
    smoothScrolling($(".main-menu ul li a[href^='#']"), headerHeight);
  });

  $("#budget_input").ionRangeSlider({
    min: 1000,
    max: 50000,
    step: 100,
    prefix: '$',
    prettify_separator: ',',
    // onChange: onBudgetChange,
    skin: "round"
  });
  $("#duration_input").ionRangeSlider({
    min: 1,
    max: 12,
    prettify: prettyMonth,
    // onChange: onDurationChange,
    skin: "round"
  });

  const budgetRange = $("#budget_input").data("ionRangeSlider");
  const durationRange = $("#duration_input").data("ionRangeSlider");

  function prettyMonth(val) {
    const suffix = val === 1 ? ' Month' : ' Months';
    return val + suffix;
  }

  function onDurationChange(data) {
    const val = data.from;
    const budget = val * 160 * RATE;
    budgetRange.update({ from : budget });
  }

  function onBudgetChange(data) {
    const val = data.from;
    const duration = Math.ceil((val / RATE)/160);
    durationRange.update({ from: duration });
  }

});
