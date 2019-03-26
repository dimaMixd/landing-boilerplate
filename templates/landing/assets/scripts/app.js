$(function() {
    $window = $(window);
    $sticky_img = $('#sticky-img');
    $lang = $('html')[0].lang

    $('.nav-links a').on('click', function(e) {
        if( !$(this).hasClass('lang') ) {
            e.preventDefault();
            if(window.innerWidth < 768) {
                $('.menu-burger').toggleClass('change');
                $('.nav-links').toggle();
            }
            $href = $(this).attr('href');
            $('html, body').animate({
                scrollTop: $($href).offset().top + 5
            })
        }
    })

    $('.menu-burger').on('click', function() {
        $(this).toggleClass('change');
        $('.nav-links').toggle();
    })

    $window.on('scroll', function() {
        $scroll = $window.scrollTop();
        $nav_links = $('.nav-links');
        $active_link = $('.nav-links a.active-li');
        $sticky_img = $('#sticky-img');
        //offsets
        $register = $('#register');
        $awards = $('#awards');
        $rules = $('#rules');
        $coffee = $('#coffee');
        $winners = $('#winners');
        
        if( $scroll > $register.offset().top && $scroll < $register.offset().top + $register.height() ) {
            $active_link.removeClass('active-li');
            $nav_links.find('a[data-active="register"]').addClass('active-li');
        }
        else if( $scroll > $awards.offset().top && $scroll < $awards.offset().top + $awards.height() ) {
            $active_link.removeClass('active-li');
            $nav_links.find('a[data-active="awards"]').addClass('active-li');
        }
        else if( $scroll > $rules.offset().top && $scroll < $rules.offset().top + $rules.height() ) {
            $active_link.removeClass('active-li');
            $nav_links.find('a[data-active="rules"]').addClass('active-li');
        }
        else if( $scroll > $coffee.offset().top - 76 && $scroll < $coffee.offset().top + $coffee.height() ) {
            $active_link.removeClass('active-li');
            $nav_links.find('a[data-active="coffee"]').addClass('active-li');
        }
        else if( $scroll > $winners.offset().top - 76 && $scroll < $winners.offset().top + $winners.height() ) {
            $active_link.removeClass('active-li');
            $nav_links.find('a[data-active="winners"]').addClass('active-li');
        }

        if(window.innerWidth > 767) {
            if($scroll > $rules.offset().top && $scroll < $rules.offset().top + $rules.height() - $sticky_img.height() ) {
                
                $sticky_img.css({
                    'transform': 'translate3d(0,'+($scroll - $rules.offset().top) + 'px,0)'
                })
            }
        }

    })

    dbErrors = {
        control_data: {
            "et": "Kontrolli sisestatud andmeid",
            "ee": "Kontrolli sisestatud andmeid",
            "rus": "Проверьте введенные данные",
            "ru": "Проверьте введенные данные"
        },
        successful_register: {
            "et": "Tšeki registreerimine õnnestus",
            "ee": "Tšeki registreerimine õnnestus",
            "rus": "Чек успешно зарегистрирован",
            "ru": "Чек успешно зарегистрирован"
        },
        error_register: {
            "et": "Tšeki registreerimine ebaõnnestus",
            "ee": "Tšeki registreerimine ebaõnnestus",
            "rus": "Регистрация чека не удалась",
            "ru": "Регистрация чека не удалась"
        },
        error_exists: {
            "et": "Selline tšekk on juba registreeritud",
            "ee": "Selline tšekk on juba registreeritud",
            "rus": "Данный чек уже зарегистрирован",
            "ru": "Данный чек уже зарегистрирован"
        }
    
    };

    $(document).on('submit', '#form', function( event ) {

        event.preventDefault(); 
        var btn = $('button[type="submit"]');
        btn.attr('disabled', true);
        var form = $(this);

        var name = $('input[name=name]').val(),
            email = $('input[name=email]').val(),
            soov = $('input[name=soov]').val(),
            $tsekk = $('input[name=tsekk]'),
            tsekid = [];
    
        $tsekk.each(function(e, data){
            if ( (/.+/gi).test($(data).val()) ) {
                tsekid.push( $(data).val() );
                $(data).attr("data-exists-id", $(data).val());
            }
        })
    
        var errs = [];
        if (name.length < 2) errs.push("name");
        if (tsekid.length<1) errs.push("tsekid");
    
        if (errs.length > 0) {
            showNotification(dbErrors.control_data[$lang], 'fail');
            btn.removeAttr('disabled');
            return false;
        }
    
        //sendEvent("Click", "Register tsekid", String(tsekid.length));
    
        var data = {};
        data.name = name;
        data.register = true;
        data.email = email;
        data.soov = soov;
        data.auth_token = tkn;
        data.tsekid = tsekid;
        var dataJSON = JSON.stringify(data);

        $.ajax({
            url: "/kohv/loosimine/",
            dataType: "json",
            data: data,
            cache: false,
            method: "POST",
            complete: function(resp, status){
                if (resp.status == 200 && status == "success") {
                    var response = resp.responseJSON;
                    if (response.success) {
                        showNotification(dbErrors.successful_register[$lang], 'success');
                        form.trigger('reset');
                    } else if (response.exists) {
                        showNotification(dbErrors.error_exists[$lang], 'fail');
                        if (response.data) {
                            for (var i in response.data) {
                                if (response.data[i] === true) {
                                    showNotification(dbErrors.error_exists[$lang], 'fail');
                                } else {
                                    showNotification(i, 'fail');
                                }
                            }
                        }
                    } else {
                        showNotification(dbErrors.error_register[$lang], 'fail');
                    }
                    return;
                }
                btn.removeAttr('disabled');
                showNotification(dbErrors.error_register[$lang], 'fail');
            }
        })
    });

    $rules_content = $('#rules-content').html();

    var modal = new tingle.modal({
        footer: false,
        stickyFooter: false,
        closeMethods: ['overlay', 'button', 'escape'],
        closeLabel: "Sulge",
        cssClass: ['custom-class-1', 'custom-class-2'],
    });

    modal.setContent($rules_content);

    $('.tingle-modal-trigger').on('click', function(){
        modal.open();
    })
})

function showNotification(msg, status) {
	$('#response-message').html(msg).addClass(status);
}

var getWinners = function(url){
    var url = (url === 'et') ? '/kohv/loosimine/data/?auth_token=' : '/kohv/loosimine/data/?auth_token='
    $.ajax({
        url: url+tkn,
        dataType: "json",
        complete:function(resp, status){
            if (status == "success" && resp.status == 200) {
                var data = resp.responseJSON;
                if(data!=null) {
                    var dataWinContentTypes = ["reis-1000", "reis-2000"];
                    for (var i in dataWinContentTypes) {
                        $("ol[data-win-content='"+dataWinContentTypes[i]+"']").empty();
                    }
                    var winners = [
                        [], // reis 1000
                        [] // reis 2000
                    ];
                    for (var i in data) {
                        winners[data[i].win_type-1].push(data[i].name);
                    }
                    for (var i in winners) {
                        if (winners[i].length>0) {
                            var t = "";
                            for (var k in winners[i]) {
                                t += "<li>"+winners[i][k]+"</li>";
                            }
                            $("[data-win-content='"+dataWinContentTypes[i]+"']").removeClass("d-none");
                            $("ol[data-win-content='"+dataWinContentTypes[i]+"']").append(t);
                        }
                    }
                }
            }
        }
    });
}
getWinners();