const ROOT_TEMPLATE = [
    {
        folderName: "screens",
        files: [{
            fileName: "splash.screen.dart",
            content: `import 'package:flutter/material.dart';

            class SplashScreen extends StatefulWidget {
              const SplashScreen({super.key});
            
              @override
              State<SplashScreen> createState() => _SplashScreenState();
            }
            
            class _SplashScreenState extends State<SplashScreen> {
              @override
              Widget build(BuildContext context) {
                return const Placeholder();
              }
            }`
        }]
    }
];


const PACKAGE_TEMPLATE = [
    {
        folderName: "screens",
        files: ["package.screen.dart"]
    }
];

export default ROOT_TEMPLATE;