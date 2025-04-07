import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>
        
        <Separator className="mb-8" />
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            This Privacy Policy describes how AfriLearnHub collects, uses, and shares your personal information when you use our platform.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
          
          <h3 className="text-xl font-medium mt-6 mb-3">1.1 Personal Information</h3>
          <p>
            When you create an account, we collect information such as:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Your name, email address, and username</li>
            <li>Educational information, including your current education level</li>
            <li>Profile information that you choose to provide</li>
            <li>Contact information, including phone number and address (optional)</li>
          </ul>
          
          <h3 className="text-xl font-medium mt-6 mb-3">1.2 Usage Information</h3>
          <p>
            We collect information about how you use our platform, including:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Pages you view and features you access</li>
            <li>Actions you take within the platform</li>
            <li>Time spent on various pages</li>
            <li>Course enrollment and completion status</li>
            <li>Assignment submissions and assessment results</li>
          </ul>
          
          <h3 className="text-xl font-medium mt-6 mb-3">1.3 Technical Information</h3>
          <p>
            We automatically collect certain technical information when you visit our platform, such as:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>IP address</li>
            <li>Device type and operating system</li>
            <li>Browser type and version</li>
            <li>Time zone setting and location</li>
            <li>Browser plug-in types and versions</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
          
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Provide, maintain, and improve our educational platform</li>
            <li>Personalize your learning experience and recommend relevant courses and resources</li>
            <li>Facilitate communication between students, instructors, employers, and educational institutions</li>
            <li>Process enrollment requests, assignments, and assessments</li>
            <li>Match students with appropriate career opportunities and guidance</li>
            <li>Analyze usage patterns to enhance our platform's features and functionality</li>
            <li>Ensure the security of your account and our platform</li>
            <li>Comply with legal obligations</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Information Sharing and Disclosure</h2>
          
          <p>We may share your information with:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li><strong>Educational Institutions:</strong> If you are a student, we may share relevant information with educational institutions you're associated with, including enrollment status, academic progress, and assessment results.</li>
            <li><strong>Employers:</strong> If you apply for jobs or internships through our platform, we will share relevant information with potential employers as part of the application process.</li>
            <li><strong>Instructors:</strong> Your course participation, submissions, and progress information may be shared with instructors of courses you're enrolled in.</li>
            <li><strong>Service Providers:</strong> We may share information with third-party service providers who perform services on our behalf, such as hosting, analytics, and customer support.</li>
            <li><strong>Legal Requirements:</strong> We may disclose information if required by law, regulation, or legal process.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Security</h2>
          
          <p>
            We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, use, disclosure, alteration, or destruction. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Your Rights</h2>
          
          <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>The right to access your personal information</li>
            <li>The right to correct inaccurate or incomplete information</li>
            <li>The right to request deletion of your personal information</li>
            <li>The right to restrict or object to processing of your personal information</li>
            <li>The right to data portability</li>
            <li>The right to withdraw consent</li>
          </ul>
          
          <p className="mt-4">
            To exercise any of these rights, please contact us at privacy@afrilearnhub.com.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Children's Privacy</h2>
          
          <p>
            Our platform is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Changes to This Privacy Policy</h2>
          
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact Us</h2>
          
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="mt-2">
            Email: privacy@afrilearnhub.com<br />
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