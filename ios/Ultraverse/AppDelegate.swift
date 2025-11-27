import UIKit
import UnityFramework
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?
  var ufw: UnityFramework?
  var applaunchOptions: [UIApplication.LaunchOptionsKey: Any]?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    
    applaunchOptions = launchOptions
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "Ultraverse",
      in: window,
      launchOptions: launchOptions
    )
//    initUnity(launchOptions: launchOptions)

    return true
  }
  
  @objc func initUnity(launchOptions: [UIApplication.LaunchOptionsKey: Any]?) {
    // Load UnityFramework
    let bundlePath = Bundle.main.bundlePath + "/Frameworks/UnityFramework.framework"
    guard let bundle = Bundle(path: bundlePath) else {
      print("UnityFramework bundle not found at: \(bundlePath)")
      return
    }
    
    if !bundle.isLoaded {
      _ = try? bundle.load()
    }
    
    // Get UnityFramework instance
    guard let ufwClass = bundle.principalClass as? UnityFramework.Type else {
      print("Could not get UnityFramework class")
      return
    }
    let ufwInstance = ufwClass.getInstance()
    self.ufw = ufwInstance
    
    // Set the Data Bundle ID — this should be same as your Unity Framework’s data bundle
    ufwInstance?.setDataBundleId("com.unity3d.framework") // adjust if needed
    
    // Run Unity embedded
    ufwInstance?.runEmbedded(
      withArgc: CommandLine.argc,
      argv: CommandLine.unsafeArgv,
      appLaunchOpts: launchOptions
    )
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
