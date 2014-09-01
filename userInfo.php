<?php
        include_once('../skin/db.php');
        $name = $_POST['name'];
        $lvl = $_POST['lvl'];
        if(mysql_query("
                INSERT INTO leaderboard (name,lvl)
                VALUES('$name', '$lvl')
                ON DUPLICATE KEY UPDATE 
                lvl=VALUES(lvl)"
        ))
        echo "Successfully Inserted";
        else
        echo "Insertion Failed";
         
?>