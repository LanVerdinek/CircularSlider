var meja = 0;
var id = 1;
var barve = {1: "red", 2: "orange", 3: "green", 4: "blue", 5: "purple"};
var stanje_miske = false;
var miska_izbrani = 1;

function koordinate_konec_kroga(c1,c2,radius,angle){
    return [c1+Math.cos(angle)*radius, c2+Math.sin(angle)*radius];
}

function premiki(e){
    if (stanje_miske == true){
      var os_x = e.pageX;
      var os_y = e.pageY;
      //console.log(e.srcElement.id);
      //console.log("KOORDINATE", os_x, os_y);
      var indeks_skupine = e.srcElement.id.slice(-1);
      var trenutni_circle = document.getElementById(indeks_skupine);
      var boundingClientLeft = trenutni_circle.getBoundingClientRect().left;
      var boundingClientTop = trenutni_circle.getBoundingClientRect().top;
      var trenutni_circle = document.getElementById(indeks_skupine);
      izracunaj_offset(e.srcElement.id, os_x - (trenutni_circle.getBoundingClientRect().left), os_y - (trenutni_circle.getBoundingClientRect().top));
    }
    else{
      e.preventDefault();
    }
}

function izracunaj_offset(id_podatek, x, y){
  if (id_podatek == miska_izbrani){
    var id_trenutnega = id_podatek.slice(-1);
    var notranji_del = document.getElementById("inside_line"+id_trenutnega);
    var radius = notranji_del.getAttribute("r");
    //console.log("KOORDINATE", x, y);
    var atan = Math.atan2(x - radius, y - radius);
    //console.log("ATAN", atan);
    var stopinje = Math.ceil(-atan / (Math.PI / 180) + 180);
    var kazalec = document.getElementById("krogec"+(id_trenutnega));

    var nekaj = koordinate_konec_kroga(250, 250, Number(id_trenutnega)*45, (stopinje-90)*(Math.PI / 180));
    //console.log(stopinje, Number(id_trenutnega)*45);
    kazalec.setAttribute("cx", nekaj[0]);
    kazalec.setAttribute("cy", nekaj[1]);

    var deljeno = stopinje / 360;
    //console.log("RADIJ", radius);
    //console.log("STOPINJE", stopinje);
    deljeno = deljeno - 0.25;
    var trenutni_input = document.getElementById("input"+id_trenutnega);
    var max_inputa = trenutni_input.getAttribute("max");
    var min_inputa = trenutni_input.getAttribute("min");

    var odstevek = max_inputa - min_inputa;

    var celotna_dolzina = notranji_del.getTotalLength();
    notranji_del.style.strokeDasharray = celotna_dolzina;

    if (deljeno < 0){
      var zamenjava_dve = deljeno * -1;
      var popravek_dve = 1 - zamenjava_dve;
      deljeno = popravek_dve;
    }
    //console.log("TRETJE", deljeno);
    var vrednost = deljeno * odstevek;
    vrednost = Number(min_inputa) + vrednost;
    trenutni_input.value = vrednost;
    //console.log("value", trenutni_input.value);
    trenutna_cena = document.getElementById("span"+id_trenutnega);
    var ime = trenutna_cena.getAttribute("class");

    //console.log(Math.round(vrednost));
    trenutna_cena.innerHtml = Math.round(vrednost);
    trenutna_cena.textContent = ime + ": " + "€" + Math.round(vrednost);

    var dashoffset = celotna_dolzina * (1 - deljeno);
    notranji_del.style.strokeDashoffset = dashoffset;
  }
}

function ustvari() {
    var div = document.getElementById("demo");
    if (meja < 5){
      var radij = (meja+1)*45;
      var svg = document.getElementById("id_bari");
      var color = barve[id];

      var prvi_podatek = document.getElementById("minimum").value;
      var drugi_podatek = document.getElementById("maksimum").value;
      var ime_podatka = document.getElementById("name").value;

      if (prvi_podatek == "" || drugi_podatek == ""){
        alert("PROSIM VNESITE MIN/MAX POLJA");
        return;
      }

      if (ime_podatka == ""){
        alert("PROSIM VNESITE IME");
        return;
      }
        
      if (prvi_podatek > drugi_podatek){
        alert("PROSIM VNESITE VREDNOSTI PRAVILNE VELIKOSTI");
        return;
      }

      if (isNaN(prvi_podatek) == true || isNaN(drugi_podatek) == true){
        alert("PROSIM VNESITE ŠTEVILKE");
        return;
      }
      //console.log(prvi_podatek, drugi_podatek);
      var min = prvi_podatek;
      var max = drugi_podatek;
      var step = 1;

      var ime = "circular_slider"+id;
      //console.log(ime);

      ime = new novi_slider({
        id: id,
        container: ".bari",
        color: color,
        min: min,
        max: max,
        step: 1,
        radius: radij,
        ime: ime_podatka
      });
      meja += 1;
    }
      else{
        alert("DOSEGLI STE MEJO");
      }
    }

function novi_slider(options) {
      var posamezen_element = document.createElementNS("http://www.w3.org/2000/svg", "g");
      posamezen_element.setAttribute("id", options.id);
      posamezen_element.setAttribute("class", "posamezen_element"+options.id);
      //posamezen_element.setAttribute("onclick", "izbran(this);");
      posamezen_element.setAttribute("onmousemove", "premiki(event);");
      posamezen_element.setAttribute("ontouchmove", "premiki(event);");
      var za_appendat = "posamezen_element"+options.id;
      id++;
      //console.log(id);

      var zunanje_crte = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      zunanje_crte.setAttribute("id", "outside_line"+(options.id));
      zunanje_crte.setAttribute("cx", 250);
      zunanje_crte.setAttribute("cy", 250);
      zunanje_crte.setAttribute("r", options.radius);
      zunanje_crte.setAttribute("stroke-width", 22);
      zunanje_crte.setAttribute("stroke", "grey");
      zunanje_crte.setAttribute("fill", "none");
      //zunanje_crte.setAttribute("onclick", "dobi_podatke(this);");
      //console.log("."+za_appendat);

      document.querySelector(options.container).appendChild(posamezen_element);
      document.querySelector("."+za_appendat).appendChild(zunanje_crte);

      var notranje_crte = document.createElementNS("http://www.w3.org/2000/svg","circle");
      notranje_crte.setAttribute("id", "inside_line"+(options.id));
      notranje_crte.setAttribute("cx", 250);
      notranje_crte.setAttribute("cy", 250);
      notranje_crte.setAttribute("r", options.radius);
      notranje_crte.setAttribute("stroke-width", 16);
      notranje_crte.setAttribute("fill", "none");
      notranje_crte.style.stroke = options.color;

      document.querySelector("."+za_appendat).appendChild(notranje_crte);

      var input = document.createElement("input");
      input.setAttribute("type", "range");
      input.setAttribute("id", "input"+(options.id));
      input.setAttribute("class", "ranger");
      input.setAttribute("name", "points");
      input.setAttribute("min", options.min);
      input.setAttribute("max", options.max);
      input.setAttribute("step", options.step);
      input.setAttribute("value", 0);

      var div_cen = document.createElement("div");
      div_cen.setAttribute("id", "div"+(options.id));
      div_cen.setAttribute("class", "podatki_cen");

      document.querySelector("."+za_appendat).appendChild(input);

      var cene = document.createElement("span");
      cene.setAttribute("id", "span"+(options.id));
      cene.setAttribute("class", options.ime);
      cene.setAttribute("unselectable", "on");
      cene.textContent = options.ime+": ";

      document.querySelector(".cenovnik").appendChild(div_cen);
      document.querySelector("#div"+(options.id)).appendChild(cene);

      var legenda_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      legenda_svg.setAttribute("id", "svg_legenda"+(options.id));
      legenda_svg.setAttribute("width", 20);
      legenda_svg.setAttribute("height", 20);

      var legenda_krogec = document.createElementNS("http://www.w3.org/2000/svg","circle");
      legenda_krogec.setAttribute("id", "legenda"+(options.id));
      legenda_krogec.setAttribute("r", 6);
      legenda_krogec.setAttribute("cx", 10);
      legenda_krogec.setAttribute("cy", 10);
      legenda_krogec.setAttribute("unselectable", "on");
      legenda_krogec.setAttribute("class", "krogec");
      legenda_krogec.setAttribute("stroke-width", 5);
      legenda_krogec.setAttribute("fill", "grey");
      legenda_krogec.style.stroke = options.color;

      document.querySelector("#div"+(options.id)).appendChild(legenda_svg);
      document.querySelector("#svg_legenda"+(options.id)).appendChild(legenda_krogec);

      var mali_krog = document.createElementNS("http://www.w3.org/2000/svg","circle");
      mali_krog.setAttribute("id", "krogec"+(options.id));
      mali_krog.setAttribute("cx", 250);
      mali_krog.setAttribute("cy", 250);
      mali_krog.setAttribute("r", 10);
      mali_krog.setAttribute("unselectable", "on");
      mali_krog.setAttribute("class", "krogec");
      mali_krog.setAttribute("stroke-width", 5);
      mali_krog.setAttribute("fill", "grey");
      mali_krog.style.stroke = options.color;

      document.querySelector(options.container).appendChild(mali_krog);

      posamezen_element.addEventListener("mousedown", e => {
        stanje_miske = true;
        //console.log(stanje_miske);
        var os_x = e.pageX;
        var os_y = e.pageY;
        //console.log(os_x, os_y);
        var indeks_test = e.srcElement.id.slice(-1);
        miska_izbrani = e.srcElement.id;
        //console.log(miska_izbrani);
        izracunaj_offset(e.srcElement.id, os_x - (posamezen_element.getBoundingClientRect().left), os_y - (posamezen_element.getBoundingClientRect().top));
        //delaj(stanje_miske);
      });
      document.addEventListener("mouseup", e => {
        stanje_miske = false;
        //var os_x = e.pageX;
        //var os_y = e.pageY;
        //console.log(os_x, os_y);
        //console.log(stanje_miske);
      });
      posamezen_element.addEventListener("touchstart", e => {
        stanje_miske = true;
        //console.log(stanje_miske);
        var os_x = e.pageX;
        var os_y = e.pageY;
        miska_izbrani = e.srcElement.id;
        izracunaj_offset(e.srcElement.id, os_x - (posamezen_element.getBoundingClientRect().left), os_y - (posamezen_element.getBoundingClientRect().top));
      });
      document.addEventListener("touchend", e => {
        stanje_miske = false;
        //var os_x = e.pageX;
        //var os_y = e.pageY;
        //console.log(stanje_miske);
        //console.log(os_x, os_y);
      });
  }
