let primary_color = localStorage.getItem('primary_color') || '#7366ff';
let secondary_color = localStorage.getItem('secondary_color') || '#f73164';
export var pieChart2: any = {
    chartType: 'PieChart',
    dataTable: [
      ['One Way', 'Hours per Day'],
      ['Round Trip', 5],
      ['Out Station One Way', 10],
      ['Out Station Round Trip', 15],
      ['Daily', 20],
    ],
    options: {
      title: 'My Daily Activities',
      is3D: true,
      width: '100%',
      height: 400,
      colors: [ "#51bb25", "#a927f9", secondary_color, primary_color],
      backgroundColor: 'transparent'
    },
  };
  