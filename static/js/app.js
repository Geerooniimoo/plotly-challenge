
displayOptions();
showData();

function displayOptions() {
    d3.json('samples.json').then(data => {
        var { names } = data;
        names.forEach(name => d3.select('select').append('option').text(name));
    });
};

function showData() {
    d3.json('samples.json').then(({ metadata, samples }) => {
        var selection = d3.select('select').property('value');
        metadata = metadata.filter(obj => obj.id == selection)[0];
        d3.select('.panel-body').html('');
        Object.entries(metadata).forEach(([key, val]) => {
            d3.select('.panel-body').append('h5').text(`${key.toUpperCase()}: ${val}`);
        });

        samples = samples.filter(obj => obj.id == selection)[0];
        var { otu_ids, sample_values, otu_labels } = samples;

        var barData = [{y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(), x:sample_values.slice(0,10).reverse(), text:otu_labels.slice(0,10).reverse(), type:'bar', orientation:'h'}];
        var barLayout = {title: {text: '<b>Top 10 Bacteria Cultures Found</b>','y':0.8},titlefont:{size:20}, margin: { t: 140, l: 150 }};
        Plotly.newPlot('bar', barData, barLayout);

        var bubbleData = [{y: otu_ids, x:sample_values, text:otu_labels, mode:'markers', marker:{size:sample_values, color:otu_ids, colorscale:'Earth'}}];
        var bubbleLayout = {title:'Bacteria Cultures Per Sample', margin:{t:0},hovermode: 'closest',
            xaxis:{title:'OTU ID'}, margin: {t:30}};
        Plotly.newPlot('bubble', bubbleData, bubbleLayout);

        var gaugeData = [{domain:{x:[0,1], y:[0,1]}, value:metadata.wfreq, title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week" }, type:"indicator", mode:"gauge+number", delta:{reference:400}, gauge:{axis:{range:[null,10]}, bar:{color:'black'}, steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "yellowgreen" },
            { range: [8, 10], color: "green" }]     }}];
        Plotly.newPlot('gauge', gaugeData, {autosize:true});
    });
};

optionChanged = ()=>showData();