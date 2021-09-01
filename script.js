var subNames = [], hours = [], grades = [], totalHours = 0, final = 0;
function getTable() {
    var n = document.getElementById('numberOfSubjects').value;
    document.getElementById('getSubjectData').innerHTML = "";
    var t = "";
    for (var i = 0; i < n; i++) {
        t += "<div class='container p-2'>";
        t += "<div class='row'>";
        t += "<div class='col-sm-12 col-md-4 p-1'>";
        t += "<input type='text' class='form-control' id='sub_" + i + "' value='' placeholder='اسم الماده اية؟'>";
        t += "</div>";
        t += "<div class='col-sm-12 col-md-4 p-1'>";
        t += "<input type='text' class='form-control' id='grade_" + i + "' value='' placeholder='الدرجة او التقدير *' min='0'>";
        t += "</div>";
        t += "<div class='col-sm-12 col-md-4 p-1'>";
        t += "<select id='hours_" + i + "' class='form-select form-select-sm'><option selected='selected' disabled value=''>*عدد ساعات الماده؟</option><option value=1>1</option><option value=2>2</option><option value=3>3</option><option value=4>4</option></select>";
        t += "</div>";
        t += "</div>";
        t += "</div>";
    }
    if (n > 0) {
        t += "<div class='row text-center justify-content-center'>";
        t += "<lable>عندك GPA قديم؟</lable><br>";
        t += "</div>";
        t += "<div class='row text-center justify-content-center'>";
        t += "<div class='col '>";
        t += "<input class='form-check-input' type='radio' name='OldGPA' value='Yes' onclick='toggleRadioButton(\"Yes\")'>اه";
        t += "<input class='form-check-input' type='radio' name='OldGPA' value='No' checked onclick='toggleRadioButton(\"No\")'>لا";
        t += "</div>";
        t += "</div>";
        t += "<div class='containter p-1'>";
        t += "<div id='GPAInputs' class='row text-center justify-content-center'></div>";
        t += "</div>";
        t += "<div class='row text-center justify-content-center p-2'>";
        t += "<div class='col-md-2'>";
        t += '<button type="button" class="btn btn-outline-secondary" style="" id="calcGPA" onclick="calcGPA()">احسبلى ال GPA</button>';
        t += "</div>";
        t += "</div>";
    }
    document.getElementById('getSubjectData').innerHTML = t;
    if (document.getElementById('getSubjectData').innerHTML != "")
        document.getElementById('calcGPA').style.display = "block";
    else
        document.getElementById('calcGPA').style.display = "none";
}
function calcGPA() {
    var n = document.getElementById('numberOfSubjects').value;
    grades.length = 0;
    subNames.length = 0;
    hours.length = 0;
    var checkedRadios = document.getElementsByName('OldGPA');
    var checkedRadio = checkedRadios[0].checked ? checkedRadios[0].value : checkedRadios[1].value;
    if (checkedRadio == "Yes" && document.getElementById("OldGPA").value == "") {
        alert("دخل GPA التراكمى!"); return;
    }
    else if (checkedRadio == "Yes" && document.getElementById("OldGPAHours").value == "") {
        alert("دخل عدد الساعات اللى درستها"); return;
    }
    for (var i = 0; i < n; i++) {
        var sub = "sub_" + i;
        var grade = "grade_" + i;
        var hour = "hours_" + i;
        if (document.getElementById(grade).value == "" || document.getElementById(hour).value == "") {
            alert("دخل الداتا يا عم!");
            return;
        }
        else if (document.getElementById(grade).value < 0) {
            alert("درجه اية دى يسطا اللى اقل من الصفر نهارك ابيض");
            return;
        }
        else if (document.getElementById(grade).value > document.getElementById(hour).value * 50) {
            alert("ازاى يعنى هتجيب " + document.getElementById(grade).value + " والماده اصلا من " + (document.getElementById(hour).value * 50));
            return;
        }
        if (document.getElementById(sub).value == "")
            subNames.push("Subject_" + (i + 1));
        else
            subNames.push(document.getElementById(sub).value);
        grades.push(document.getElementById(grade).value);
        hours.push(parseInt(document.getElementById(hour).value));
        totalHours += hours[i];
    }
    var temp, gradeSymbole = [];
    for (i = 0; i < n; i++) {
        temp = isNaN(grades[i]) ? grades[i] : (grades[i] * 100.00) / (50.0 * hours[i]);
        final += GetGrade(temp, hours[i]);
        gradeSymbole[i] = GetGradeSymboleForSubject(temp);
    }
    document.getElementById('output').innerHTML = "";
    var res = ""; currentGPA = 0; totalGPA = 0;
    var currentGPA = final * 1.0 / totalHours;
    if (checkedRadio == "Yes") {
        var OldGPA = document.getElementById("OldGPA").value;
        var OldGPAHours = document.getElementById("OldGPAHours").value;
        var totalGPA = (OldGPA * OldGPAHours + currentGPA * totalHours) / (parseFloat(totalHours) + parseFloat(OldGPAHours));
        totalGPA = totalGPA.toFixed(5);
    }
    totalHours = 0, final = 0;
    currentGPA = currentGPA.toFixed(5);
    res += '<div class="card" style="width: 25rem;margin: 0 auto;">';
    res += "<ul class='list-group list-group-flush' style='padding: 0px;'>";
    for (i = 0; i < n; i++) {
        res += "<li class='list-group-item'>" + subNames[i] + "  تقديرك فيها " + gradeSymbole[i] + "</li>";
    }
    res += "<li class='list-group-item'>تقديرك الفصلى " + currentGPA + " - " + GetGradeSymboleForGPA(currentGPA); +"</li>";
    if (checkedRadio == "Yes") {
        res += "<li class='list-group-item'>تقديرك التراكمى " + totalGPA + " - " + GetGradeSymboleForGPA(totalGPA); +"</li>";
    }
    else
        totalGPA = currentGPA;
    res += Msg(totalGPA);
    totalGPA = 0;
    currentGPA = 0;
    OldGPAHours = 0;
    OldGPA = 0;
    res += "</ul>";
    res += "</div>";
    document.getElementById('output').innerHTML = res;
}

function GetGradeSymboleForSubject(grade) {
    if (grade >= 90.0 || grade.toString().toLowerCase() == "a")
        return "A";
    else if (grade < 90.0 && grade >= 85.0 || grade.toString().toLowerCase() == "a-")
        return "-A";
    else if (grade < 85.0 && grade >= 80.0 || grade.toString().toLowerCase() == "b+")
        return "+B";
    else if (grade < 80.0 && grade >= 75.0 || grade.toString().toLowerCase() == "b")
        return "B";
    else if (grade < 75.0 && grade >= 70.0 || grade.toString().toLowerCase() == "c+")
        return "+C";
    else if (grade < 70.0 && grade >= 65.0 || grade.toString().toLowerCase() == "c")
        return "C";
    else if (grade < 65.0 && grade >= 60.0 || grade.toString().toLowerCase() == "d")
        return "D";
    else
        return "F";
}

function GetGradeSymboleForGPA(grade) {
    if (grade == 4)
        return "A";
    else if (grade >= 3.67)
        return "-A";
    else if (grade >= 3.33)
        return "+B";
    else if (grade >= 3.0)
        return "B";
    else if (grade >= 2.67)
        return "+C";
    else if (grade >= 2.33)
        return "C";
    else if (grade >= 2.0)
        return "D";
    else
        return "F";
}

function GetGrade(temp, hours) {
    if (temp >= 90.0 || temp.toString().toLowerCase() == "a")
        return 4 * hours;
    else if (temp < 90.0 && temp >= 85.0 || temp.toString().toLowerCase() == "a-")
        return 3.67 * hours;
    else if (temp < 85.0 && temp >= 80.0 || temp.toString().toLowerCase() == "b+")
        return 3.33 * hours;
    else if (temp < 80.0 && temp >= 75.0 || temp.toString().toLowerCase() == "b")
        return 3 * hours;
    else if (temp < 75.0 && temp >= 70.0 || temp.toString().toLowerCase() == "c+")
        return 2.67 * hours;
    else if (temp < 70.0 && temp >= 65.0 || temp.toString().toLowerCase() == "c")
        return 2.33 * hours;
    else if (temp < 65.0 && temp >= 60.0 || temp.toString().toLowerCase() == "d")
        return 2 * hours;
    else
        return 0;
}
function Msg(totalGPA) {
    if (totalGPA > 3.5)
        return "<li class='list-group-item'>عاش  يسطا  استمرD:</li>";
    else if (totalGPA > 3)
        return "<li class='list-group-item'>شد حيلك يلا مش عايزين ال جيد جدا تروح</li>";
    else if (totalGPA > 2.33)
        return "<li class='list-group-item'>لا فوق بقا كده عايزين نجيب جيد جدا فى شوال</li>";
    else if (totalGPA > 2)
        return "<li class='list-group-item'>لا فوق بقا كده عايزين نجيب جيد جدا فى شوال</li>";
    else
        return "<li class='list-group-item'> عايزين بقا حبه جد علشان نرفع الGPA </li>";
}
function toggleRadioButton(x) {
    if (x == "Yes") {
        document.getElementById("GPAInputs").innerHTML = "<div class='col-sm-12 col-md-4'><input type='number' id='OldGPA' placeholder='GPA القديم' class='form-control' min=0></div>";
        document.getElementById("GPAInputs").innerHTML += "<div class='col-sm-12 col-md-4'><input type='number' id='OldGPAHours' placeholder='عدد الساعات' class='form-control' min=0></div>";
    }
    else {
        document.getElementById("GPAInputs").innerHTML = "";
    }
}