function onPageLoad() {
    // Assign selDataset div to dropdown var
    var dropdown = d3.select("#selDataset");

    // Read data
    d3.json("data/samples.json").then((data) => {
        // console.log(data);
        data.names.forEach(function (name) {
            dropdown.append("option").text(name).property("value");
        });

        display_data(data.names[0]);
        dyna_demos(data.names[0]);
        // console.log(display_data)
        // console.log(dyna_demos)
    })
}
onPageLoad();

function display_data(id) {
    // 1. Use the D3 library to read in `samples.json`.
    d3.json("data/samples.json").then(json_samples => {

        // Returns: names, metadata, samples. Correct.
        // console.log(json_samples)

        var selection = json_samples.samples
        // console.log(selection)

        // This is the filter that allows you to drop all the ".samples[0]" from below
        var selection_filter = selection.filter(sampleid => sampleid.id.toString() === id)[0];

        var ID = selection_filter.otu_ids;
        // Returns: 1167, 2859, 482. Correct.
        console.log(`OTU IDs (Before) - Read in data

${ID}`)
        // 2. Display top 10 OTU; Use `otu_ids` as the labels for the bar chart.
        // Take the first 10 values from ln7 and reverse the order.
        // var otu_ids = (selection_filter.samples[0].otu_ids.slice(0, 10)).reverse();
        var otu_ids = (selection_filter.otu_ids.slice(0, 10)).reverse();
        var append_otu = otu_ids.map(d => "OTU " + d);
        console.log(`OTU IDs (After) - Slice 10, append "OTU", reverse

${append_otu}`)

        // var s_values = selection_filter.samples[0].sample_values;
        var s_values = selection_filter.sample_values;
        // Returns: 163, 126, 113. Correct.
        console.log(`OTU Values (Before) - Read in data

${s_values}`)

        // 2. Display top 10 OTU; Use `sample_values` as the values for the bar chart.
        // var sample_values = (selection_filter.sample_values.samples[0].slice(0, 10)).reverse();
        var sample_values = (selection_filter.sample_values.slice(0, 10)).reverse();
        console.log(`OTU Values (After) - Slice 10, reverse

${sample_values}`)

        // var labels = selection_filter.samples[0].otu_labels;
        var labels = selection_filter.otu_labels;
        // Returns: Bacteria;Bacteroidetes;Bacteroidia. Correct.
        console.log(`OTU Labels (Before) - Read in data
    
${labels}`)

        // 2. Display top 10 OTU; Use `otu_labels` as the hovertext for the chart.
        // var otu_labels = selection_filter.otu_labels.samples[0].slice(0, 10);
        var otu_labels = selection_filter.otu_labels.slice(0, 10);
        console.log(`OTU Labels (After)
    
${otu_labels}`)

        var bar_trace = {
            x: sample_values,
            y: append_otu,
            text: otu_labels,
            marker: {
                color: 'navyblue'
            },
            type: "bar",
            orientation: "h",
        };

        // Data array consists of trace
        var bar_data = [bar_trace];

        var bar_layout = {
            title: "Top 10 OTU",
            font: {
                size: 10,
            },
        };

        var bar_config = {
            toImageButtonOptions: {
                format: 'svg', // one of png, svg, jpeg, webp
                filename: 'Top 10 OTU',
                height: 500,
                width: 700,
                scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
            }
        };

        // Create Top 10 OTU Bar Chart
        // Plotly.newPlot(graphDiv, data, layout, config)
        Plotly.newPlot("bar", bar_data, bar_layout, bar_config);

        var bubble_trace = {
            // * Use `otu_ids` for the x values.
            x: selection_filter.otu_ids,
            // * Use `sample_values` for the y values.
            y: selection_filter.sample_values,
            mode: "markers",
            marker: {
                // * Use `sample_values` for the marker size.
                size: selection_filter.sample_values,
                // * Use `otu_ids` for the marker colors.
                color: selection_filter.otu_ids
            },
            // * Use `otu_labels` for the text values.
            text: selection_filter.otu_labels
        };

        var bubble_layout = {
            xaxis: {
                title: "OTU ID"
            },
        }

        // Data array consists of trace
        var bubble_data = [bubble_trace]

        // 3. Create a bubble chart that displays each sample.
        Plotly.newPlot("bubble", bubble_data, bubble_layout)

    })

}

// 4. Display the sample metadata, i.e., an individual's demographic information.
function dyna_demos(id) {
    d3.json("data/samples.json").then((demodata) => {
        var metadata = demodata.metadata;
        // Returns Object:Object when you use `${}`
        console.log(metadata);

        // Select sample-metadata section
        var demographicInfo = d3.select("#sample-metadata");
        // Clear contents
        // demographicInfo.html("Test");
        demographicInfo.html("");

        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        // 5. Display each key-value pair from the metadata JSON object somewhere on the page.
        Object.entries(result).forEach((key) => {
            demographicInfo.append("h6").text(key[0] + ": " + key[1]);
        });
    });
}

// 6. Update all of the plots any time that a new sample is selected.
function optionChanged(id) {
    display_data(id);
    dyna_demos(id);
}