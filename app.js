console.log("Hello " + process.argv[1] + " " + process.argv[2]);
const commandLineArgs = require('command-line-args');
fs = require('fs');
const optionDefinitions = [
    {name: 'project', alias: 'p', type: String, defaultValue: '.'},
    {name: 'file', alias: 'f', type: String},
    {name: 'replace', alias: 'r', type: String, defaultValue: 'v([\\d.]+)\\s*(built\\s*on)\\s*(\\d*)'},
    {name: 'remove', alias: 'm', type: String, defaultValue: '-'}
]

const options = commandLineArgs(optionDefinitions)
console.log("options " + JSON.stringify(options));
if (!options.file) {
    console.log("Usage ");
}
var git = require('simple-git')
if (options.project) {
    git = require('simple-git')(options.project);
}

git.pull(function (err, res) {
    if (err) {
        console.log("Error in pull " + JSON.stringify(err));
        return;
    }
    console.log("Pulled successfully ");
    git.tags(function (err, tags) {
        if (err) {
            console.log("Error in getting tags " + JSON.stringify(err));
            return;
        }
        if (!tags.latest) {
            console.log("Not found latest tag ");
            return;
        }
        console.log("Found latest tag " + tags.latest);
        var content = '';
        fs.readFile(options.file, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            console.log(data);

            var regex01 = new RegExp(options.remove, "g");
            tags.latest = tags.latest.replace(regex01, ' ');

            var regex = new RegExp(options.replace, "g");
            content = data.replace(regex, tags.latest);

            console.log("Updated the version in " + options.file + " successfully");
            console.log("New version " + tags.latest);

            fs.writeFile(options.file, content, function (err, data) {


            })
        });

    })
})
