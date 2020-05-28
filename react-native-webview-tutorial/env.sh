# shellcheck shell=bash
if [ -z "$1" ]
then
    echo "Please inform Android SDK path"
    return
fi

JH=$(dirname -- "$(dirname -- "$(command -v java)")")
export JAVA_HOME=$JH

export ANDROID_HOME=$1
export ANDROID_SDK_ROOT=$ANDROID_HOME
export ANDROID_NDK_ROOT=$ANDROID_HOME/ndk/19.2.5345600
export ANDROID_NDK_PLATFORM=android-26

export PATH=$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$ANDROID_NDK_ROOT:$PATH
