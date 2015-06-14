var side = document.getElementById('side'), bg = document.getElementById('side-bg'), posts = document.getElementById('posts'), fixed = document.getElementById('fixed'), toggle = document.getElementById('toggle');
var open = false;

var t = function(evt){
    evt.preventDefault();
    //dude(null,300);
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
var view
, direction = true // down if true. up if false 
, lastScroll = document.documentElement.scrollTop
, scrollLoad = 500; // 

/*
*
* Let's model some Elements, Sugar
*
*/

// ÂºSidebar
var Sidebar = function(){};

Sidebar.prototype.snippets = document.querySelector('.snippets');
Sidebar.prototype.snippetcontainer = document.querySelector('.snippetcontainer');
Sidebar.prototype.req = new XMLHttpRequest();
Sidebar.prototype.display = 6;  // We load up 6 for appearances
Sidebar.prototype.next = function(){};
Sidebar.prototype.prev = function(){};
Sidebar.prototype.req.onload = function(data){
    var matches = data.currentTarget.responseText.match(/<\/article>/g) || []
    ,more = matches.length;
    Sidebar.prototype.snippetcontainer.innerHTML += data.currentTarget.responseText;
    Sidebar.prototype.display += more;
}
Sidebar.prototype.more = function(){
    var display = Sidebar.prototype.display;
    // if (server.posts != display){
    //     Sidebar.prototype.req.open("GET", "/snippet/"+ display +"/"+ (display + 6) + "/", true);
    //     Sidebar.prototype.req.send();
    // }
    view.sidebar.next();
}

// ÂºSearch
var Search = function(){};

Search.prototype.done = false;
Search.prototype.query = "";
Search.prototype.results = document.querySelector('.infinite-scroll');
Search.prototype.bar = document.querySelector('.search-bar input') || {};
Search.prototype.bar.onkeydown = function(e){
    console.log(e);
    if(e.which == 13) Search.prototype.glass.onclick();
}
Search.prototype.glass = document.querySelector('.search-glass')  || {};
Search.prototype.glass.onclick = function(){
    window.location = "http://d.omini.ca?s=" + encodeURIComponent(Search.prototype.bar.value).replace("%20","+");
}
Search.prototype.req = new XMLHttpRequest();
Search.prototype.count = 5; // We start with 5
Search.prototype.req.onload = function(data){
    var matches = data.currentTarget.responseText.match(/<\/article>/g) || []
    ,more = matches.length;
    Search.prototype.results.innerHTML += data.currentTarget.responseText;
    Search.prototype.count += matches.length;
    Search.prototype.done = matches.length != 5;
}

/*
*
* Let's define an Interface for Different Browser States, Hunny
*
*/


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

// Blog objects and their Polymorphic handlers.
View.prototype.sidebar = new Sidebar();
View.prototype._sidebar = function(){throw "- Sidebar Requires Override";};
//View.prototype.comments = new Comments();
//View.prototype._comments = function(){throw "- Comments Require Override";};

// Home objects and their Polymorphic handlers.
//View.prototype.scroller = new Scroller();
//View.prototype._scroller = function(){throw "- Scroller Requires Override";};
View.prototype.search = new Search();
View.prototype._search = function(){throw "- Search Requires Override";};

View.prototype.initBlog = function(){
    size = 250;
    this._scroll = function(){
        this.parallaxtitle.style.marginTop = ((document.documentElement.getBoundingClientRect().top/.9) - 86) + "px";
    }
};
View.prototype.initHome = function(){
    size = 450;
    this._scroll = function(){
        if(window._postmodern.hasLogo) this.parallaxlogo.style.top = (document.documentElement.getBoundingClientRect().top/2) + "px";
        if(window._postmodern.author) this.parallaxlogo.style.top = (document.documentElement.getBoundingClientRect().top/2) + "px";
        this.parallaxfast.style.top = (document.documentElement.getBoundingClientRect().top/3) + "px";
        this.parallaxmed.style.top  = (document.documentElement.getBoundingClientRect().top/5) + "px";
        this.parallaxslow.style.top = (document.documentElement.getBoundingClientRect().top/8) + "px";
    }
};

/*
*
* Let's make those Objects Baby.
*
*/

// Âºdesktop
var desktop =  new View();
desktop._sidebar = function(){}
desktop._search = function(){
    this.search.query = /(?:^\?|\&)s\=([^&]*)/g.exec(window.location.search);
    this.search.query = Object.prototype.toString.call([]) == Object.prototype.toString.call(this.search.query) 
                        ? this.search.query[1] : "";
    this._searchScroll = function(x){
        var bounds = document.querySelector('footer').getBoundingClientRect();
        if( bounds.bottom - window.innerHeight <= scrollLoad && !this.search.done){
        //    this.search.req.open("GET", "/content/"+ this.search.count +"/"+ (this.search.count + 5) + "/" + this.search.query.replace(" ","+"), true);
        //    this.search.req.send();
        }
    }
    this._searchScroll();
}
desktop._sidebarScroll = function(){};
desktop._searchScroll = function(){};
desktop._scroll = function(){
    this._sidebarScroll();
    this._searchScroll();
}

// Âºtablet
var tablet = new View();
tablet._sidebar = function(){   
    Sidebar.prototype.snippetcontainer.style.top = 0 + "px";
    this.sidebar.pos = 0;
    this.sidebar.posmax = 5;//(server.posts - 3) * -190;
    this.sidebar.next = function(){
        this.pos -= this.pos <= this.posmax ? 0 : 570;
        Sidebar.prototype.snippetcontainer.style.top= this.pos + "px";
    }
    this.sidebar.prev = function(){
        view.sidebar.pos += view.sidebar.pos == 0 ? 0 : 570;
        Sidebar.prototype.snippetcontainer.style.top = view.sidebar.pos + "px";
    }   
    document.querySelector('.down').addEventListener('click', this.sidebar.more, false);
    document.querySelector('.up').addEventListener('click', this.sidebar.prev, false);
};
tablet._search = desktop._search;
tablet._searchScroll = function(){};
tablet._scroll = function(){
    tablet._searchScroll();
}

// Âºmobile
var mobile = new View();
mobile._sidebar = function(){
    this.sidebar.next = function(){}
};
mobile._search = tablet._search;
mobile._searchScroll = function(){};
mobile._sidebarScroll = function(x){
    var bounds = document.querySelector('footer').getBoundingClientRect();
//    if(server.page == 'blog' && bounds.bottom - window.innerHeight <= scrollLoad){
//        this.sidebar.more();
//    }
}
mobile._scroll = function(){
    mobile._searchScroll();
    mobile._sidebarScroll();
}

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


var size;
startView = function(){
    if (!window._postmodern.post){
        view.initHome();
    }else{
        view.initBlog();
    }
}

setView(window.innerWidth);

window.onresize = function(event) {
    dude();
    setView(window.innerWidth);
    view._scroll(document.documentElement.scrollTop);
}

window.onscroll = function(event) {
    view._scroll(document.documentElement.scrollTop);
}

window.onfocus = function(event){
    // prevents funkiness
    document.body.className = document.body.className;
}

var banner = document.getElementById('banner-img');
var c;
var canvas = document.getElementById('banner');
var dude = function(){
    var height = size < document.getElementById('banner-img').height ? size : document.getElementById('banner-img').height;
    var width = document.body.scrollWidth < document.getElementById('banner-img').width ? document.body.scrollWidth : document.getElementById('banner-img').width;
    canvas.setAttribute('height', height + 'px');
    canvas.setAttribute('width', width + 'px');
    c = document.getElementById('banner').getContext('2d');
    c.drawImage(document.getElementById('banner-img'),0,0)

    ratio = 0.5 + document.body.scrollWidth/document.getElementById('banner-img').width;

    console.log(ratio);
    stackBlurCanvasRGBA("banner", 0, 0, width, height, ratio * 10);

    d = c.getImageData(0, 0, width, height).data
    max = 0;
    var r = g = b = 0;
    for (var i=0; i<d.length; i+=4) {
        var temp = d[i]/3 + d[i+2]/3 + d[i+3]/3;
        if (temp > max) {
            max = temp;
        }
    }

    //r = Math.floor(r/total).toString(16)
    //g = Math.floor(g/total).toString(16)
    //b = Math.floor(b/total).toString(16)

    //color = "#" + r + g + b
    if(max > 175){
        document.querySelector('.damp').style.opacity = (max-175)/255;
    }
}

banner.onload = dude;
canvas.onresize = dude;
window.onload = dude;