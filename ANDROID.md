When debugging or runing on device that is
plugged into usb you need to run the following
from the command line.

$ react-native start
$ adb reverse tcp:8081 tcp:8081
$ react-native run-android

You will want to make sure that you turn off "JS Dev Mode," or else it
will run painfully slow on device.

After running "react-native run-android" you should "shake" your device
to bring up the menu. Select "Dev Settings" then uncheck "JS Dev Mode."

After that run "react-native run-android" again and it should be much
more performant.


https://facebook.github.io/react-native/docs/signed-apk-android.html
$ react-native start
$ adb reverse tcp:8081 tcp:8081
$ react-native run-android
