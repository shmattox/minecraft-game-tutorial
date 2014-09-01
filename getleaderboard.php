<?php
include_once('db.php');
$database="apex_leaderboard";
@mysql_select_db($database) or die( "Unable to select database");
$query="SELECT * FROM leaderboard ORDER BY lvl DESC LIMIT 10";
$result=mysql_query($query);
$num=mysql_numrows($result);
mysql_close();
$i=0;
while ($i < $num) {
        $name=mysql_result($result,$i,"name");
        $lvl=mysql_result($result,$i,"lvl");
        echo "<li><span>$name</span><span>$lvl</span></li>";
        $i++;
}
?>