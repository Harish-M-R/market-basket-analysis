@echo off
set PATH=C:\Program Files\Common Files\Oracle\Java\javapath_target_2947453;%PATH%
cd /d "C:\Users\Harish\OneDrive\Desktop\Big Boys\market-basket-analysis\src"
set HADOOP_HOME=C:\hadoop-3.4.2\hadoop-3.4.2

echo Compiling Java files...
echo.

javac -classpath "%HADOOP_HOME%\share\hadoop\common\*;%HADOOP_HOME%\share\hadoop\mapreduce\*;%HADOOP_HOME%\share\hadoop\common\lib\*" -d ..\output *.java 2>&1

echo.
echo Exit code: %ERRORLEVEL%
echo.

if %ERRORLEVEL% EQU 0 (
    echo Compilation successful!
    cd ..\output
    dir *.class
    echo.
    echo Creating JAR file...
    jar -cvf marketbasket.jar *.class
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo SUCCESS! JAR created:
        dir marketbasket.jar
    )
) else (
    echo.
    echo Compilation failed with exit code: %ERRORLEVEL%
    echo Checking if any class files were created...
    dir ..\output\*.class 2>nul
)

pause
