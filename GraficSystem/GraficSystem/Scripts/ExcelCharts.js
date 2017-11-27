var dataToGraph = [];
var columnsD = [];
var table;
function handlet(e)
{
    dataToGraph = [];
    columnsD = [];
    var files = e.target.files, f = files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
    var data = e.target.result;
    var workbook = XLSX.read(data, { type: 'binary' });
    workbook.SheetNames.forEach(function (key) {                
            $.each(XLSX.utils.sheet_to_json(workbook.Sheets[key])[0], function (key, value) {
                columnsD.push(key);
            });
            var container = document.getElementById('xple');
                table = new Handsontable(container, {
                data: XLSX.utils.sheet_to_json(workbook.Sheets[key]),
                colHeaders: columnsD,
                stretchH: 'all',
                width: 900,
                autoWrapRow: true,
                height: 300,
                //maxRows: 60,
                manualRowMove: true,
                manualColumnMove: true,
                filters: true

            });

        });

        $.each(table.getData(), function (key, value) {
            var o = {};
            $.each(value, function (key, value) {
                o[columnsD[key]] = value;
            });
            dataToGraph.push(o);
        });
        console.log(dataToGraph);
    };
    reader.readAsBinaryString(f);
}
$(document).ready(function () {
    $("#browse").click(function () {
        $("#file").click();
    });
    $("#file").change(handlet);


});
        

var module = angular.module('excelApp', []);
module.controller('chart', function ($scope) {
    $scope.chart = null;
    $scope.config = {};
    $scope.typeOptions = ["line", "bar", "spline", "step", "area"];
    $scope.config.type = $scope.typeOptions[0];
    $scope.axis;
    $scope.value = { heads:[]};

    $scope.show = function () {
        $scope.columns = columnsD;
        var config = {};
        config.bindto = '#chart';
        config.data = {};
        config.data.json = dataToGraph;
        config.data.keys = { x: $scope.axis, "value": $scope.value.heads };
        config.data.type = $scope.config.type;
        config.zoom = { enabled: true };
        config.axis = { x: { type: 'category' } };
        $scope.chart = c3.generate(config);
    }

});