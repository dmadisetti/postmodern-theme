(function postmodern(){
    // Element Grab
    var side = document.getElementById('side'), 
        bg   = document.getElementById('side-bg'),
        posts = document.getElementById('posts'),
        fixed = document.getElementById('fixed'),
        toggle = document.getElementById('toggle')
        banner = document.getElementById('banner-img'),
        canvas = document.getElementById('banner');
    
    var t = function(evt){
        evt.preventDefault();
        if(open){
            side.classList.add('fade');
            if(bg) bg.classList.add('none');
            if(fixed) fixed.classList.add('grow');
            if(posts) posts.classList.add('grow');
        }else{
            side.classList.remove('fade');
            if(bg) bg.classList.remove('none');
            if(fixed) fixed.classList.remove('grow');
            if(posts) posts.classList.remove('grow');
        }
        open = !open;
    }
    
    toggle.addEventListener('click',t);
    bg.addEventListener('click',t);
    
    // Just some basic global variables
    var view,
        size,
        open = false,
        direction = true, // down if true. up if false
        lastScroll = document.documentElement.scrollTop;
    
    
    // ÂºView
    // Lets wrap it in one big class and init for different pages. 
    // I aint got time all day to be making several layers of prototype
    // Plus. Potentially push state. Anybody? Anybody?
    var View = function(){};
    
    // Everybody do the parallax scroll. Do do do do.
    View.prototype.parallaxfast    = document.querySelector('.parallax-fast');
    View.prototype.parallaxmed     = document.querySelector('.parallax-med');
    View.prototype.parallaxslow    = document.querySelector('.parallax-slow');
    View.prototype.parallaxlogo    = document.querySelector('.parallax-logo');
    View.prototype.parallaxtitle   = document.querySelector('.parallax-title');
    View.prototype._parallaxscroll = function(x){
    
        this._scroll(x);
    
        direction = x > lastScroll;
        lastScroll = x;
    }
    View.prototype._scroll = function(x){throw "- Scroll Requires Override";};
    
    View.prototype.initBlog = function(){
        size = 250;
        this._scroll = function(){
            this.parallaxtitle.style.marginTop = ((document.documentElement.getBoundingClientRect().top/.9) - 86) + "px";
        }
    };
    View.prototype.initHome = function(){
        size = 450;
        this._scroll = function(x){
            if(window._postmodern.hasLogo) this.parallaxlogo.style.top = (document.documentElement.getBoundingClientRect().top/2) + "px";
            if(window._postmodern.author) this.parallaxlogo.style.top = (document.documentElement.getBoundingClientRect().top/2) + "px";
            this.parallaxfast.style.top = (document.documentElement.getBoundingClientRect().top/3) + "px";
            this.parallaxmed.style.top  = (document.documentElement.getBoundingClientRect().top/5) + "px";
            this.parallaxslow.style.top = (document.documentElement.getBoundingClientRect().top/8) + "px";
        }
    };
    
    /*
    *
    * Let's make those Objects.
    *
    */
    
    
    //  Guilty of pro optimization. No need for these yet
    // Âºdesktop
    var desktop =  new View();
    
    // Âºtablet
    var tablet = new View();
    
    // Âºmobile
    var mobile = new View();
    
    /*
    *
    * Let's Run this thing.
    *
    */
    
    setView = function(x){
        switch(true){
            case x > 1250:
                if(view != desktop){
                    view = desktop;
                    startView();
                }
                break;
            case x <= 1250 && x >= 924:
                if(view != tablet){
                    view = tablet;
                    startView();
                }
                break;
            default:
                if(view != mobile){
                    view = mobile;
                    startView();
                }           
                break;
        }
    }
    
    startView = function(){
        if (!window._postmodern.post){
            view.initHome();
        }else{
            view.initBlog();
        }
    }
    
    setView(window.innerWidth);


    /*
    *
    * Capture page changes
    *
    */
    
    window.onresize = function(event) {
        cover();
        setView(window.innerWidth);
        if(view != mobile)
        view._scroll(document.documentElement.scrollTop);
    }
    
    window.onscroll = function(event) {
        if(view != mobile)
        view._scroll(document.documentElement.scrollTop);
    }
    
    window.onfocus = function(event){
        // prevents funkiness
        document.body.className = document.body.className;
    }
    
    var cover = function(){
    
        if(!banner) return;

        // Get the height and width for these guys
        var height = size < banner.height ? size : banner.height,
            width = document.body.scrollWidth < banner.width ? document.body.scrollWidth : banner.width;
    
        // Set calced size
        canvas.setAttribute('height', height + 'px');
        canvas.setAttribute('width', width + 'px');
    
        // Grab context
        var c = canvas.getContext('2d');
        c.drawImage(banner,0,0)
    
        // How much should we blur?
        var ratio = 0.5 + document.body.scrollWidth/banner.width;
        stackBlurCanvasRGBA("banner", 0, 0, width, height, ratio * 10);
    
        // Find out how light the image is
        var d = c.getImageData(0, 0, width, height).data,
            max = 0,
            r = g = b = 0;
    
        for (var i=0; i<d.length; i+=4) {
            var temp = d[i]/3 + d[i+2]/3 + d[i+3]/3;
            if (temp > max) {
                max = temp;
            }
        }
    
        // Darken for readable text color
        if(max > 175){
            document.querySelector('.damp').style.opacity = (max-175)/255;
        }
    }

    banner.onload = cover;
    canvas.onresize = cover;
    window.onload = cover;

})()