document.addEventListener("DOMContentLoaded", () => {
    d3.json("/countries.json")
        .then(countries => {
            d3.csv("/maternity-leave-by-country-1995-2013.csv")
                .then(mutterschaftsUrlaub => {

                    const width = 800;
                    const height = 600;

                    const svgContainer = d3.select('#viz');

                    const svg = svgContainer.append('svg')
                        .attr('width', width)
                        .attr('height', height);

                    const projection = d3.geoMollweide()
                        .translate([width / 2, height / 2])
                        .scale(140);

                    const pathGenerator = d3.geoPath().projection(projection);

                    const graticule = d3.geoGraticule()()

                    const graticulePath = svg.append("path")
                        .attr("d", pathGenerator(graticule))
                        .attr("fill", "transparent")
                        .attr("stroke", "#EEE")
                        .attr("stroke-width", 0.5)

                    const scale = d3.scaleOrdinal()
                        .domain([1, 2, 3, 4, 5])
                        .range(["#f63355", "#cbfcf8", "#81dfdf", "#3399a2", "#005667"]);

                    const world = svg.selectAll("path")
                        .data(countries.features)
                        .enter()
                        .append("path")
                        .attr("d", d => pathGenerator(d))
                        .attr("fill", country => {
                            const land = mutterschaftsUrlaub.find(d => d.iso3 === country.properties.ADM0_A3);
                            return land ? scale(land.matleave_2013) : "#EEE"
                        });

                    annotationCreaton(-110, 400, "USA");
                    annotationCreaton(-110, 200, "Mexico");


                    function annotationCreaton(coordinateA, coordinateB, text) {
                        const annotation = svg.append("g")
                            .attr("transform", function () {
                                const coords = projection([coordinateA, coordinateB]);
                                return "translate(" + coords[0] + " " + coords[1] + ")"
                            });

                        annotation.append("text")
                            .attr("text-anchor", "middle")
                            .attr("alignment-baseline", "middle")
                            .text(text)
                            .attr("x", -50)
                            .attr("font-size", "18px")

                        annotation.append("line")
                            .attr("x2", -15)
                            .attr("stroke", "black")
                    }
                })


        })
});
