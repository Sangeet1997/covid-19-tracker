const fetchData = async (str) =>{
    const response = await axios.get(`https://api.covid19api.com/${str}`);
    //console.log(response.data);
    return response.data;
}

let confirmed = document.querySelector(".confirmed");
let active = document.querySelector(".active");
let recovered = document.querySelector(".recovered");
let death = document.querySelector(".death");

let graphContainer = document.querySelector(".graph-container");

const setData = async (country) =>{
    graphContainer.innerHTML = "";
    let data;
    response2 = await axios.get("https://api.covid19api.com/summary");
    if(!country){
        response = await axios.get(`https://covid19.mathdro.id/api/daily`);
        
        //response3 = await axios.get("https://api.covid19api.com/summary");
        console.log(response2.data);

        let confirmedVal = response2.data.Global.TotalConfirmed;
        let recoveredVal = response2.data.Global.TotalRecovered;
        let deathVal = response2.data.Global.TotalDeaths;
        let activeVal = confirmedVal - recoveredVal - deathVal;

        let totalcon = recoveredVal + deathVal + activeVal;
        let recper = (recoveredVal/totalcon * 100).toFixed(2);
        let deaper = (deathVal/totalcon * 100).toFixed(2);
        let actper = (activeVal/totalcon * 100).toFixed(2);

        confirmed.textContent = numberWithCommas(confirmedVal);
        active.textContent = numberWithCommas(activeVal)+"  ("+actper+" %)";
        recovered.textContent = numberWithCommas(recoveredVal)+"  ("+recper+" %)";
        death.textContent = numberWithCommas(deathVal)+"  ("+deaper+" %)";

        

        let carr = [];
        let darr = [];
        let narr = [];
        let datearr = [];

        for(let i = 0;i<response.data.length;i++)
        {
            carr[i] = response.data[i].confirmed.total;
            darr[i] = response.data[i].deaths.total;
            if(i === 0)
                narr[i] = carr[i];
            else
                narr[i] = carr[i] - carr[i-1];
            datearr[i] = datef(response.data[i].reportDate);
        }
        graphContainer.innerHTML=`
        <div><canvas id="myChartp" class="pie"></canvas></div>
            <div><canvas id="myChart1"></canvas></div>
            <div class="small-graph">
                <div><canvas id="myChart2"></canvas></div>
                <div><canvas id="myChart3"></canvas></div>
            </div>
        `;

        //pie chart
        var ctxp = document.getElementById('myChartp').getContext('2d');

        drawPie(ctxp,[activeVal,recoveredVal,deathVal]);

        let ctx1 = document.getElementById('myChart1').getContext('2d');
        let ctx2 = document.getElementById('myChart2').getContext('2d');
        let ctx3 = document.getElementById('myChart3').getContext('2d');
        
        drawChart(ctx1,"line",datearr,carr,"Confirmed","rgb(255, 109, 0, 0.3)","rgb(255, 109, 0)");
        drawChart(ctx2,"line",datearr,darr,"Death","rgb(66, 66, 66, 0.3)","rgb(66, 66, 66)");
        drawChart(ctx3,"bar",datearr,narr,"New Cases","rgb(255, 183, 77, 0.9)","rgb(255, 183, 77)");

    }
    else{
        data = await fetchData(`total/country/${country.Slug}`);
        console.log(data);
        let confirmedVal = data[data.length-1].Confirmed;
        let activeVal = data[data.length-1].Active;
        let recoveredVal = data[data.length-1].Recovered;
        let deathVal = data[data.length-1].Deaths;

        let totalcon = recoveredVal + deathVal + activeVal;
        let recper = (recoveredVal/totalcon * 100).toFixed(2);
        let deaper = (deathVal/totalcon * 100).toFixed(2);
        let actper = (activeVal/totalcon * 100).toFixed(2);

        confirmed.textContent = numberWithCommas(confirmedVal);
        active.textContent = numberWithCommas(activeVal)+"  ("+actper+" %)";
        recovered.textContent = numberWithCommas(recoveredVal)+"  ("+recper+" %)";
        death.textContent = numberWithCommas(deathVal)+"  ("+deaper+" %)";
        

        let carr = [];
        let aarr = [];
        let rarr = [];
        let darr = [];
        let narr = [];
        let datearr = [];
        let j = 0;
        for(let i = 0;i<data.length;i++)
        {
            if(data[i].Confirmed>0)
            {
                carr[j++] = data[i].Confirmed;
                aarr[j-1] = data[i].Active;
                rarr[j-1] = data[i].Recovered;
                darr[j-1] = data[i].Deaths;
                if(j==1)
                    narr[j-1] = carr[j-1];
                else
                    narr[j-1] = carr[j-1]-carr[j-2];
                datearr[j-1] = datef(data[i].Date);
            }
        }
        console.log(datearr);

        graphContainer.innerHTML=`
        <div><canvas id="myChartp" class="pie"></canvas></div>
            <div><canvas id="myChart1"></canvas></div>
            <div class="small-graph">
                <div><canvas id="myChart2"></canvas></div>
                <div><canvas id="myChart3"></canvas></div>
            </div>
            <div class="small-graph">
                <div><canvas id="myChart4"></canvas></div>
                <div><canvas id="myChart5"></canvas></div>
            </div>
        `;

        //pie chart
        var ctxp = document.getElementById('myChartp').getContext('2d');

        drawPie(ctxp,[activeVal,recoveredVal,deathVal]);

        let ctx1 = document.getElementById('myChart1').getContext('2d');
        let ctx2 = document.getElementById('myChart2').getContext('2d');
        let ctx3 = document.getElementById('myChart3').getContext('2d');
        let ctx4 = document.getElementById('myChart4').getContext('2d');
        let ctx5 = document.getElementById('myChart5').getContext('2d');

        drawChart(ctx1,"line",datearr,carr,"Confirmed","rgb(255, 109, 0, 0.3)","rgb(255, 109, 0)");
        drawChart(ctx2,"line",datearr,aarr,"Active","rgb(244, 67, 54, 0.3)","rgb(244, 67, 54)");
        drawChart(ctx3,"line",datearr,rarr,"Recovered","rgb(104, 159, 56, 0.3)","rgb(104, 159, 56)");
        drawChart(ctx4,"line",datearr,darr,"Death","rgb(66, 66, 66, 0.3)","rgb(66, 66, 66)");
        drawChart(ctx5,"bar",datearr,narr,"New Cases","rgb(255, 183, 77, 0.9)","rgb(255, 183, 77)");
    }

    $(document).ready(function() {
        $('#example').DataTable( {
            data: response2.data.Countries,
            columns: [
                { "data": "Country" },
                { "data": "TotalConfirmed" },
                { "data": "TotalDeaths" },
                { "data": "TotalRecovered" },
                { "data": "NewConfirmed" },
                { "data": "NewDeaths" },
                { "data": "NewRecovered" },
            ]
        } );
    } );

}

const root = document.querySelector(".autocomplete");
    
root.innerHTML = `
<input class="input" placeholder="Search any Country" />
<div class="dropdown">
    <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
    </div>
</div>
`;
const dropdown = document.querySelector(".dropdown");
const input = document.querySelector(".input");
const result = document.querySelector(".results");

document.addEventListener("click",event=>{
    if(!root.contains(event.target)) {
        dropdown.classList.remove('is-active');
    }
});

const changeData = event =>{
    if(event.target.value==="")
    {
        dropdown.classList.remove("is-active");
        return;
    }
    
    const filtered = countries.filter(country=>{
        return country.Country.toLowerCase().includes(event.target.value.toLowerCase());
    })

    const trimmed = [];
    
    if(filtered.length>10)
    {
        for(let i = 0;i<10;i++)
            trimmed[i] = filtered[i];
    }
    else{
        for(country of filtered)
            trimmed.push(country);
    }


    result.innerHTML = "";
    dropdown.classList.add("is-active");
    trimmed.forEach(country=>
    {
        const option = document.createElement("a");
        option.classList.add("dropdown-item");
        option.innerHTML=`${country.Country}`;
        
        option.addEventListener("click",onClick);

        function onClick(){
            input.value = country.Country;
            console.log(country.Country);
            setData(country);
            dropdown.classList.remove("is-active");
        }

        result.appendChild(option);
    });
}

input.addEventListener("input",changeData);

const drawChart = (ctx,type,date,data,label,color1,color2) =>{
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: type,

        // The data for our dataset
        data: {
            labels: date,
            datasets: [{
                label: label,
                backgroundColor: color1,
                borderColor: color2,
                data: data
            }]
        },

        // Configuration options go here
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        callback: function(value, index, values) 
                        {
                            if(index%10==0)
                                return value;
                            return "";
                        }
                    }
                }]
            }
        }
    });

}

const drawPie = (ctx,data) =>{
    console.log("hello");
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ["Active","Recovered","Death"],
          datasets: [{
            backgroundColor: [
              "rgb(244, 67, 54)",
              "rgb(104, 159, 56)",
              "rgb(66, 66, 66)"
            ],
            data: data
          }]
        }
      });
}

setData();

const globalbtn = document.querySelector(".global");

globalbtn.addEventListener("click",async ()=>{
    await setData();
})

window.alert = function(){return null;}; // disable alerts