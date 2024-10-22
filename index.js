const fetchData = async (str) => {
    const response = await axios.get(`https://disease.sh/v3/covid-19/${str}`);
    console.log(response.data);
    return response.data;
};

let confirmed = document.querySelector(".confirmed");
let active = document.querySelector(".active");
let recovered = document.querySelector(".recovered");
let death = document.querySelector(".death");

let graphContainer = document.querySelector(".graph-container");

const setData = async (country) =>{
    graphContainer.innerHTML = "";
    let data;
    response2 = await axios.get("https://disease.sh/v3/covid-19/countries");
    console.log(response2.data)
    if(!country){
        const response = await axios.get(`https://disease.sh/v3/covid-19/all`);
        
        //response3 = await axios.get("https://api.covid19api.com/summary");
        console.log(response.data);

        let confirmedVal = response.data.cases;
        let recoveredVal = response.data.recovered;
        let deathVal = response.data.deaths;
        let activeVal = response.data.active;
    
        let totalcon = recoveredVal + deathVal + activeVal;
        let recper = (recoveredVal / totalcon * 100).toFixed(2);
        let deaper = (deathVal / totalcon * 100).toFixed(2);
        let actper = (activeVal / totalcon * 100).toFixed(2);
    
        confirmed.textContent = numberWithCommas(confirmedVal);
        active.textContent = numberWithCommas(activeVal) + " (" + actper + " %)";
        recovered.textContent = numberWithCommas(recoveredVal) + " (" + recper + " %)";
        death.textContent = numberWithCommas(deathVal) + " (" + deaper + " %)";

        response3 = await axios.get("https://disease.sh/v3/covid-19/historical/all?lastdays=all");

        let carr = []; // cases
        let darr = []; // death
        let narr = []; // new cases
        let datearr = []; // date

        let res3_data = response3.data;
        carr = Object.values(res3_data.cases)
        darr = Object.values(res3_data.deaths)
        datearr = Object.keys(res3_data.cases)
        recovarr = Object.values(res3_data.recovered)

        let length = carr.length;
        console.log(length);
        console.log(Object.keys(res3_data))



        for(let i = 0;i<length;i++)
        {
            if(i === 0)
                narr[i] = carr[i];
            else
                narr[i] = carr[i] - carr[i-1];
        }
        graphContainer.innerHTML=`
        <div><canvas id="myChartp" class="pie"></canvas></div>
            <div><canvas id="myChart1"></canvas></div>
            <div class="small-graph">
                <div><canvas id="myChart2"></canvas></div>
                <div><canvas id="myChart3"></canvas></div>
                <div><canvas id="myChart4"></canvas></div>
            </div>
        `;

        //pie chart
        var ctxp = document.getElementById('myChartp').getContext('2d');

        drawPie(ctxp,[activeVal,recoveredVal,deathVal]);

        let ctx1 = document.getElementById('myChart1').getContext('2d');
        let ctx2 = document.getElementById('myChart2').getContext('2d');
        let ctx3 = document.getElementById('myChart3').getContext('2d');
        let ctx4 = document.getElementById('myChart4').getContext('2d');

        
        drawChart(ctx1,"line",datearr,carr,"Confirmed","rgb(255, 109, 0, 0.3)","rgb(255, 109, 0)");
        drawChart(ctx2,"line",datearr,darr,"Death","rgb(66, 66, 66, 0.3)","rgb(66, 66, 66)");
        drawChart(ctx3,"bar",datearr,narr,"New Cases","rgb(255, 183, 77, 0.9)","rgb(255, 183, 77)");

    }
    else{
        data = await fetchData(`countries/${country.ISO2}`);
        console.log(data);

        let confirmedVal = data.cases;
        let activeVal = data.active;
        let recoveredVal = data.recovered;
        let deathVal = data.deaths;

        let totalcon = recoveredVal + deathVal + activeVal;
        let recper = (recoveredVal / totalcon * 100).toFixed(2);
        let deaper = (deathVal / totalcon * 100).toFixed(2);
        let actper = (activeVal / totalcon * 100).toFixed(2);

        confirmed.textContent = numberWithCommas(confirmedVal);
        active.textContent = numberWithCommas(activeVal) + " (" + actper + " %)";
        recovered.textContent = numberWithCommas(recoveredVal) + " (" + recper + " %)";
        death.textContent = numberWithCommas(deathVal) + " (" + deaper + " %)";

        graphContainer.innerHTML=`
        <div><canvas id="myChartp" class="pie"></canvas></div>
        `;

        //pie chart
        var ctxp = document.getElementById('myChartp').getContext('2d');

        drawPie(ctxp,[activeVal,recoveredVal,deathVal]);
    }

    $(document).ready(function() {
        $('#example').DataTable( {
            data: response2.data,
            columns: [
                { "data": "country" },
                { "data": "cases" },
                { "data": "deaths" },
                { "data": "recovered" },
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