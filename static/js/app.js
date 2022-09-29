d3.json('samples.json').then(({ names }) => {
    names.forEach(name => d3.select('select').append('option').text(name));
    showData();
});

const showData = async () => {
    let { metadata, samples } = await d3.json('samples.json');

    let sel = d3.select('select').node().value;
    let meta = metadata.filter(obj => obj.id == sel)[0];

    d3.select('.panel-body').html('');
    Object.entries(meta).forEach(([key, val]) => {
        d3.select('.panel-body').append('h5').text(`${key.toUpperCase()}: ${val}`);
    });

    let sample = samples.filter(obj => obj.id == sel)[0];
    let { otu_ids, sample_values, otu_labels } = sample;

    let barData = [{
        y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
        x: sample_values.slice(0, 10).reverse(), text: otu_labels.slice(0, 10).reverse(),
        type: 'bar',
        orientation: 'h'
    }];

    let barLayout = {
        title: {
            text: '<b>Top 10 Bacteria Cultures Found</b>',
            'y': 0.8
        },
        titlefont: { size: 20 },
        margin: { t: 140, l: 150 }
    };
    Plotly.newPlot('bar', barData, barLayout);

    let bubbleData = [{ y: otu_ids, x: sample_values, text: otu_labels, mode: 'markers', marker: { size: sample_values, color: otu_ids, colorscale: 'Earth' } }];
    let bubbleLayout = {
        title: 'Bacteria Cultures Per Sample', margin: { t: 0 }, hovermode: 'closest',
        xaxis: { title: 'OTU ID' }, margin: { t: 30 }
    };
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    let gaugeData = [{
        domain: { x: [0, 1], y: [0, 1] }, 
        value: meta.wfreq, 
        title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week" }, 
        type: "indicator", 
        mode: "gauge+number", 
        delta: { reference: 400 }, 
        gauge: {
            axis: { range: [null, 10] }, bar: { color: 'black' }, steps: [
                { range: [0, 2], color: "red" },
                { range: [2, 4], color: "orange" },
                { range: [4, 6], color: "yellow" },
                { range: [6, 8], color: "yellowgreen" },
                { range: [8, 10], color: "green" }]
        }
    }];
    Plotly.newPlot('gauge', gaugeData, { autosize: true });
};

const optionChanged = () => showData();