$(function(){
    const monthNames = ['leden', 'unor', 'brezen', 'duben', 'kveten', 'cerven', 'cervenec', 'srpen', 'Zari', 'rijen', 'listopad', 'prosinec'];

    $('.calendar-container').calendar({
        date:new Date(),
        weekDayLength: 2,
        onClickDate:function (date) {
            const currentDate = new Date(date);
            const month = String(currentDate.getMonth() + 1);
            const day = String(currentDate.getDate());
            const year = currentDate.getFullYear();

            fetch("http://localhost:5173/calendarOccupancyDay.json")
                .then ((response) => response.json())
                .then((data) => {
                    data.map((item) => {
                        if (item.hasOwnProperty(year)) {
                            item[year].map((arrayMonth) => {
                                if(arrayMonth.hasOwnProperty(monthNames[month-1])) {
                                    Swal.fire('Obsazenost ' + item.budovaName + " = " + String(arrayMonth[monthNames[month-1]][0][day]))
                                }
                            })
                        }
                    });
                });
        },
        monthMap: {
            1: "Leden",
            2: "Únor",
            3: "Březen",
            4: "Duben",
            5: "Květen",
            6: "Červen",
            7: "Červenec",
            8: "Srpen",
            9: "Září",
            10: "Říjen",
            11: "Listopad",
            12: "Prosinec",
        },

        // map the week number to a string
        alternateDayMap: {
            0: "pondělí",
            1: "úterý",
            2: "středa",
            3: "čtvrtek",
            4: "pátek",
            5: "sobota",
            6: "neděle",

        },
        startOnMonday: true,

        onClickMonthNext:function (date) {
            const currentDate = new Date(date);
            const month = String(currentDate.getMonth() + 1);
            const year = currentDate.getFullYear();

            getDataForCalendar(currentDate, month, year)
        },
        onClickMonthPrev:function (date) {
            const currentDate = new Date(date);
            const month = String(currentDate.getMonth() + 1);
            const year = currentDate.getFullYear();

            getDataForCalendar(currentDate, month, year)
        },


    });

    const currentDate = new Date();
    const month = String(currentDate.getMonth() + 1);
    const year = currentDate.getFullYear();
    getDataForCalendar(currentDate, month, year)



    function getDataForCalendar(currentDate, month, year) {

        fetch("http://localhost:5173/calendarOccupancyDay.json")
            .then ((response) => response.json())
            .then((data) => {
                data.map((item) => {
                    if (item.hasOwnProperty(year)) {
                        item[year].map((arrayMonth) => {
                            if(arrayMonth.hasOwnProperty(monthNames[month-1])) {
                                const days = document.querySelectorAll("body > div.calendar-container > div > div.weeks-container > div > div > div.month-day:not(.disabled)")
                                days.forEach((day, key) => {
                                        let currentlyOccupancy = arrayMonth[monthNames[month-1]][0][key+1];
                                        let maxOccupancy = item.maxObsazenost;
                                        let resultInPercents = currentlyOccupancy * 100 / maxOccupancy;
                                        if (resultInPercents > 0 && resultInPercents < 51) {
                                            // Yellow
                                            day.style.background = "#FFE690";
                                        }
                                        if(resultInPercents > 50 && resultInPercents < 100) {
                                            // Orange
                                            day.style.background = "#FFC47F";
                                        }
                                        if(resultInPercents == 0) {
                                            // Green
                                            day.style.background = "#C6F3BD";
                                        }
                                        if(resultInPercents == 100) {
                                            // Red
                                            day.style.background = "#FFB6B6";
                                        }
                                })
                            }
                        })
                    }
                });
            });
    }
});
