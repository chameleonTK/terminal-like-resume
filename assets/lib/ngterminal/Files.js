angular.module('ngterminal')
.factory('Files', ["$q", function($q){

    var files = [
        {"name":"blog", "type":"folder", "size":"29k"},
        {"name":"contact.txt", "type":"file", "size":"32"},
        {"name":"experiences.txt", "type":"file", "size":"1k"},
        {"name":"man", "type":"file", "size":"292"},
        {"name":"twitter", "type":"folder", "size":"430"},
        {"name":"README.md", "type":"file", "size":"3723"},
    ];

    return {
        getFiles:getFiles,
        read:read
    }

    function read(filename){
        var file = files.find(function(file){
            return file.type=="file" && file.name==filename
        })

        if (!file) {
            return false;
        }

        if (file.name=="README.md") {
            return [
                "Hi, I'm Pakawat Nakwijit.",
                " ",
                "I graduated in Computer Engineering, Kasetsart University. ",
                "I have developed an interest in Programming Languages, NLP and AI since I was in university.",
                "However, you are welcome to discuss with me about movies, adventure, and cats.",
                " ",
                "Now, I am working as a web developer at Maxile co.,ltd and ",
                "writing a blog about whatever I am interested in especially about cats.",
                " ",
                "If you would like to get in touch with me, whether it be for technical issues, or to just say hi, ",
                "don't heritate to send me an email or a tweet.",
                " ",
                "my email : pakawat.nk@gmail.com",
                "my twitter : @chameleontk",
                " ",
                "And learn more about me at http://wp.curve.in.th",
            ]
        } else if (file.name=="contact.txt"){
            return [
                "email : pakawat.nk@gmail.com",
                "twitter : @chameleontk",
                " ",
                "And learn more about me at http://wp.curve.in.th",
            ]
        } else if (file.name=="experiences.txt"){
            return [
                "2016 - present",
                "Software Developer at Maxile co.,ltd.",
                "  - CMS for website http://www.1for100.or.th",
                " ",
                "  - Ionic application: e-Tracking",
                "    Application for tracking import/export document's status",
                " ",
                "  - Neekrung Magazine http://www.neekrung.com",
                "    implemented a responsive website for Neekrung magazine.",
                " ",
                "  - eBMN project http://ebmn.cdd.go.th",
                "    An online census form which is capable of keeping more than million of data records.",
                " ",
                "Freelance",
                "  - Curator at TEDxKasetsartU",
                "    curated speakers to build an interesting talk at TEDx conference",
                " ",
                "  - Attended DevFest Hackathon 2016 ",
                "    as '25 Finalists' with Khunkrukanoomping – An intelligent chatbot on LINE platform",
                " ",
                "  - Developed FrontEnd http://www.petpolar.com",
                "    An online community for pet lovers. I worked on frontend development including web site animation, ",
                "    user interface and social features.",
                " ",
                "  - Waste challenge Game on website http://www.wastechallenge.com",
                "    participated with WWF&Hilton for awareness campaign on waste segregation. ",
                "    It's a game which users are to choose the right category of 20 wastes in 1 minute.",
                " ",
                "2015",
                "  - Published a research paper in ICSEC 2015, Chiangmai, Thailand",
                "    'A Parser Generator Using the Grammar Flow Graph'. An easier parser generator works for context-free language with acceptable performance.",
                " ",
                "  - Antikopae Project with Dr.Paruj Ratanaworabhan",
                "    worked on investigation of plagiarism in research field.",
                " ",
                "2014",
                "  - Internship student at NIST, Nara, Japan",
                "    conducted a research about code refactoring in Software Design and Analysis Laboratory",
                " ",
                "  - Asuku Project",
                "    An artificial intelligence conversation application  which uses learning model from data in http://www.ask.fm",
                " ",
                "2011 - 2013",
                "  - Teaching Assistant for Computer and Programming, Compiler,",
                "    Computer Architecture and Microprocessor",
                " ",
                "  - Kasetsart University Medal of Honor Recipient: 2011, 2012, 2013",
                " ",
                "  - Treasurer of Computer Engineering’s Student Body Organization",
                " ",
                "  - Organizer and Master of Ceremony in many activies such as Toktakcamp, Konnec#6, eXceed Camp",
                "    training camp for sophomore&junior student at Kasetsart University",
                " ",
                "  - Attended 11th Young Webmaster Camp",
                "    recieced honor for the best creative website (Punmap.com)",
                " ",
                "  - Speaker in Barcamp Bangkok and Barcamp Bangkhen",
                "    'Scratch ง่ายๆ ใน 1 นาที' in Barcamp Bangkhen 4, 2013; ",
                "    'Phalcon # The fastest PHP Framework' in Barcamp Bangkok 2014 ",
                "    'Robot 1st Times' in Barcamp Bangkhen 5, 2014;",
                "    'มาเป็นทาสแมวกันเถอะ' in Barcamp Bangkhen 6,2015;",
                " ",
                "  - Exhibited at Google I/O 2013, Thailand",
                " ",
            ]
        } else if (file.name=="man"){
            return [
                "Common commands:",
                "    ls  [-al] [folder]   list directory contents",
                "    cd  [folder]         change directory",
                "    cat [file]           concatenate and print a file",
                "    man                  format and display the on-line manual pages",
                " ",
                "For help on any individual command run tweet to me at @chameleontk",
            ]
        }

        return [];
    }

    function getFiles(){
        return files;
    }

}]);
