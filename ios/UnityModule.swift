//
//  UnityModule.swift
//  Ultraverse
//
//  Created by Raj Developer on 26/11/25.
//

import Foundation
import React

@objc(UnityModule)
class UnityModule: NSObject {

  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }

  @objc func startUnity() {
    DispatchQueue.main.async {
        if let appDelegate = UIApplication.shared.delegate as? AppDelegate {
          debugPrint("\(appDelegate.ufw?.appController())")
          appDelegate.initUnity(launchOptions: appDelegate.applaunchOptions)
        }
    }
  }

  @objc func stopUnity() {
    DispatchQueue.main.async {
      if let appDelegate = UIApplication.shared.delegate as? AppDelegate {
        appDelegate.ufw?.unloadApplication()
      }
    }
  }
}

