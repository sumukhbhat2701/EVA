fetch('https://api.covid19api.com/summary').then((response) => {return response.json();})
.then((data) => {
    const {Global} = data;
    console.log(Global);
    document.getElementById("Wcases").innerHTML = Global.TotalConfirmed;
    document.getElementById("Wdeaths").innerHTML = Global.TotalDeaths;
    document.getElementById("Wrecovered").innerHTML = Global.TotalRecovered;
});

fetch('https://api.rootnet.in/covid19-in/stats/latest').then((response) => {return response.json();})
.then((data) => {
    console.log(data);
    const summary = data.data.summary;
    const stateSummary = data.data.regional; 
    let kState;
    for(let i=0;i<stateSummary.length;i++){
        if(stateSummary[i].loc=='Karnataka')
        {
            kState = stateSummary[i];
        }
    }
    console.log(kState);
    console.log(summary);
    document.getElementById("Icases").innerHTML = summary.total;
    document.getElementById("Ideaths").innerHTML = summary.deaths;
    document.getElementById("Irecovered").innerHTML = summary.discharged;
    document.getElementById("Kcases").innerHTML = kState.totalConfirmed;
    document.getElementById("Kdeaths").innerHTML = kState.deaths;
    document.getElementById("Krecovered").innerHTML = kState.discharged;
});



function myFunction() {
  alert("Click on the bottom right part of the page to start chatting");
  /*var x = document.getElementById("EvaDiv");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }*/
}

(function(){
	$('.flex-container').waitForImages(function() {
		$('.spinner').fadeOut();
	}, $.noop, true);
	
	$(".flex-slide").each(function(){
		$(this).hover(function(){
			$(this).find('.flex-title').css({
				
				top: '10%'
			});
			$(this).find('.flex-about').css({
				opacity: '1'
			});
		}, function(){
			$(this).find('.flex-title').css({
				
				top: '15%'
			});
			$(this).find('.flex-about').css({
				opacity: '0'
			});
		})
	});
})();