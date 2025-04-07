import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function TermsPage() {
  const [_, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-8 px-4 md:py-12">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-auto mr-3"
            onClick={() => navigate("/auth")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Terms of Service</h1>
        </div>
        
        <Separator className="mb-8" />
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            Welcome to AfriLearnHub. These Terms of Service ("Terms") govern your use of our platform, website, and services. By accessing or using AfriLearnHub, you agree to be bound by these Terms.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By creating an account on AfriLearnHub or accessing any part of our platform, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to all the terms and conditions of this agreement, you may not access or use the platform.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. User Accounts</h2>
          
          <h3 className="text-xl font-medium mt-6 mb-3">2.1 Registration</h3>
          <p>
            To use certain features of AfriLearnHub, you must register for an account. When you register, you agree to provide accurate, current, and complete information about yourself as prompted by the registration form.
          </p>
          
          <h3 className="text-xl font-medium mt-6 mb-3">2.2 Account Security</h3>
          <p>
            You are responsible for maintaining the security of your account and password. AfriLearnHub cannot and will not be liable for any loss or damage from your failure to comply with this security obligation. You are responsible for all activities that occur under your account.
          </p>
          
          <h3 className="text-xl font-medium mt-6 mb-3">2.3 User Roles</h3>
          <p>
            AfriLearnHub offers different roles for users, including students, instructors, admins, employers, university admins, and ministry officials. Each role has different permissions and responsibilities within the platform.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Conduct</h2>
          <p>
            You agree not to use AfriLearnHub to:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Violate any laws or regulations</li>
            <li>Post or share content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable</li>
            <li>Impersonate any person or entity</li>
            <li>Upload or transmit viruses or any other malicious code</li>
            <li>Interfere with or disrupt the platform or servers or networks connected to the platform</li>
            <li>Collect or store personal data about other users without their consent</li>
            <li>Use the platform for any commercial solicitation purposes without our prior written consent</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Educational Content</h2>
          
          <h3 className="text-xl font-medium mt-6 mb-3">4.1 Content Ownership</h3>
          <p>
            All educational content provided by AfriLearnHub or its partners is owned by the respective content creators or licensors and is protected by copyright and other intellectual property laws.
          </p>
          
          <h3 className="text-xl font-medium mt-6 mb-3">4.2 User-Generated Content</h3>
          <p>
            By posting content on AfriLearnHub, you grant us a non-exclusive, royalty-free, perpetual, and worldwide license to use, modify, publicly display, reproduce, and distribute such content on and through the platform.
          </p>
          
          <h3 className="text-xl font-medium mt-6 mb-3">4.3 Academic Integrity</h3>
          <p>
            Users are expected to maintain academic integrity while using the platform. Plagiarism, cheating, or any form of academic dishonesty is strictly prohibited and may result in account termination.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Career Services</h2>
          <p>
            AfriLearnHub provides career guidance, job listings, and employer connections as part of its services. However, we do not guarantee employment or internship placement. Users are responsible for the accuracy of information they provide to potential employers.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Privacy</h2>
          <p>
            Your use of AfriLearnHub is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices regarding the collection and use of your personal information.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Modifications to the Platform and Terms</h2>
          <p>
            AfriLearnHub reserves the right to modify or discontinue, temporarily or permanently, the platform or any features or portions thereof without prior notice. We also reserve the right to update these Terms at any time. Continued use of the platform following any changes constitutes your acceptance of such changes.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Termination</h2>
          <p>
            AfriLearnHub may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms. Upon termination, your right to use the platform will immediately cease.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Limitation of Liability</h2>
          <p>
            In no event shall AfriLearnHub, its officers, directors, employees, or agents, be liable to you for any direct, indirect, incidental, special, punitive, or consequential damages whatsoever resulting from any:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Errors, mistakes, or inaccuracies of content</li>
            <li>Personal injury or property damage related to your use of the platform</li>
            <li>Unauthorized access to or use of our servers and/or any personal information stored therein</li>
            <li>Interruption or cessation of transmission to or from our platform</li>
            <li>Bugs, viruses, or the like that may be transmitted to or through our platform</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <p className="mt-2">
            Email: terms@afrilearnhub.com<br />
            Address: AfriLearnHub Headquarters, 123 Education Avenue, Nairobi, Kenya
          </p>
          
          <div className="mt-12 mb-6">
            <p className="text-sm text-muted-foreground">
              Last updated: April 7, 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}