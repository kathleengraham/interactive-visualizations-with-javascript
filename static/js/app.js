function buildMetadata(sample) {
  // fetch sample metadata
  let metadataURL = '/metadata/' + sample

  // select panel
  let panelMetadata = d3.select('#sample-metadata')

  // clear any existing metadata
  panelMetadata.html('')

  // append new tags for each key value
  d3.json(metadataURL).then(function(data) {
    Object.entries(data).forEach(([key, value]) => {
      panelMetadata.append('h6').text(`${key}: ${value}`)
    })
  })

}

function buildCharts(sample) {
  // fetch sample data for plots
  let chartsURL = '/samples/' + sample

  // build two charts
  d3.json(chartsURL).then(function(data) {
    
    // build pie chart
    let trace = [{
      values: data.sample_values.slice(0,10),
      labels: data.otu_ids.slice(0,10),
      hovertext: data.otu_labels.slice(0,10),
      type: 'pie',
      marker: {
        colors: ['#4D4DFF', '#C14D8B', '#FF4D4D', '#884DC4', '#99177D', '#644DE8', '#E04D6C', '#F05D5E', '#784DD4' ,'#EAA6A6']
      }
    }]

    let layout = {
      title: {
        text: 'Pie Chart'
      },
      showlegend: true
    }

    Plotly.newPlot('pie', trace, layout)

    // build bubble chart
    let trace1 = [{
      x: data.otu_ids,
      y: data.sample_values,
      mode: 'markers',
      text: data.otu_labels,
      marker: {
        color: data.otu_ids,
        size: data.sample_values,
        colorscale: 'Bluered'
      }
    }]
    
    let layout1 = {
      title: {
        text: 'Bubble Chart'
      },
      xaxis: {
        title: {
          text: 'OTU ID'
        }
      },
      showlegend: false,
      height: 600,
      width: 1500
    }

    Plotly.newPlot('bubble', trace1, layout1)
  })
}

function init() {
  // grab a reference to the dropdown select element
  let selector = d3.select('#selDataset')

  // use the list of sample names to populate the select options
  d3.json('/names').then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append('option')
        .text(sample)
        .property('value', sample)
    })

    // use the first sample from the list to build the initial plots
    let firstSample = sampleNames[0]
    buildCharts(firstSample)
    buildMetadata(firstSample)
  })
}

function optionChanged(newSample) {
  // fetch new data each time a new sample is selected
  buildCharts(newSample)
  buildMetadata(newSample)
}

// initialize the dashboard
init()