import sys
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#475569"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(50, 755, "CIVIC SENSE — HACKATHON PRESENTATION GUIDE (4-MEMBER TEAM)")
            self.drawRightString(612 - 50, 755, "Technologies, Where & Why Used, Judges Q&A")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(50, 747, 612 - 50, 747)
        
        # Footer
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(50, 42, 612 - 50, 42)
        
        self.setFont("Helvetica", 8)
        self.drawString(50, 30, "Civic Sense Hackathon Guide — Simple Language Explanation for Evaluators")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(612 - 50, 30, page_str)
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=46,
        rightMargin=46,
        topMargin=50,
        bottomMargin=50
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=4
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12.5,
        leading=16,
        textColor=colors.HexColor('#1E3A8A'),
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#0284C7'),
        spaceBefore=8,
        spaceAfter=3,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#334155'),
        spaceAfter=4
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=body_style,
        leftIndent=10,
        firstLineIndent=-6,
        spaceAfter=3
    )

    header_cell_style = ParagraphStyle(
        'HeaderCell',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#0F172A')
    )

    q_style = ParagraphStyle(
        'Q_Style',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12.5,
        textColor=colors.HexColor('#0F172A'),
        spaceBefore=5,
        spaceAfter=2,
        keepWithNext=True
    )

    a_style = ParagraphStyle(
        'A_Style',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor('#334155'),
        spaceAfter=5
    )

    elements = []

    # ================= TITLE BANNER =================
    header_data = [
        [
            Paragraph("<b>CIVIC SENSE</b><br/><font size=10 color='#2563EB'>Smart Municipal Grievance & AI Operations Platform</font>", title_style),
            Paragraph("<b>HACKATHON GUIDE & PITCH HANDBOOK</b><br/><font size=8 color='#475569'>Written in Simple Language for 4 Team Members</font>", ParagraphStyle('R_Head', parent=title_style, alignment=2, fontSize=10, leading=13))
        ]
    ]
    t_header = Table(header_data, colWidths=[330, 190])
    t_header.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(t_header)
    elements.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#1E3A8A"), spaceBefore=2, spaceAfter=8))

    # Introduction Box
    intro_box = (
        "<b>What is Civic Sense in 1 Simple Sentence:</b><br/>"
        "It is a smart website where ordinary citizens can report city problems (like potholes, broken water pipes, or garbage) "
        "just by <b>speaking in their own language</b> or snapping a photo, while municipal government officers track, update, "
        "and <b>prove the repair by uploading photos/videos</b> before closing the issue."
    )
    elements.append(Table([[Paragraph(intro_box, body_style)]], colWidths=[520], style=[
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EFF6FF")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#93C5FD")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    elements.append(Spacer(1, 8))

    # ================= 1. TECHNOLOGIES USED: WHERE & WHY =================
    elements.append(Paragraph("1. Core Technologies & Programming Languages Used (Where & Why)", h1_style))
    elements.append(Paragraph("When judges ask: <i>'What technologies or languages did you use to build this?'</i> — here is the clear, exact breakdown:", body_style))
    elements.append(Spacer(1, 3))

    tech_table_data = [
        [
            Paragraph("<b>Technology / Language</b>", header_cell_style),
            Paragraph("<b>Where It Is Used in This Project</b>", header_cell_style),
            Paragraph("<b>WHY We Used It (Simple Explanation)</b>", header_cell_style)
        ],
        [
            Paragraph("<b>JavaScript & TypeScript</b><br/><font size=7 color='#2563EB'>Main Programming Language</font>", body_style),
            Paragraph("• Used across the whole website: the forms, buttons, voice typing listener, map picker, login system, and backend APIs.", body_style),
            Paragraph("• <b>Why:</b> JavaScript is the universal language of web browsers. We used <b>TypeScript</b> (advanced JavaScript) because it catches coding errors automatically before running, preventing bugs and website crashes.", body_style)
        ],
        [
            Paragraph("<b>HTML5 & CSS3</b><br/><font size=7 color='#059669'>Web Structure & Styling</font>", body_style),
            Paragraph("• <b>HTML5:</b> Forms, camera upload inputs, audio microphone listeners, and video players.<br/>• <b>CSS3:</b> Colors, cards, buttons, status badges, and mobile responsiveness.", body_style),
            Paragraph("• <b>Why:</b> HTML gives clean structure for photos and voice tools. CSS ensures the website works smoothly on both mobile phones and laptops without stretching or breaking.", body_style)
        ],
        [
            Paragraph("<b>UI / UX Design</b><br/><font size=7 color='#D97706'>User Interface & Experience</font>", body_style),
            Paragraph("• Simple 4-step wizard: (1) Problem, (2) Location, (3) Photo/Video, (4) Submit.<br/>• Readable street addresses instead of confusing GPS numbers.<br/>• Big mic button for voice typing.", body_style),
            Paragraph("• <b>Why:</b> A civic portal must be usable by ordinary, non-technical citizens. Good UI/UX ensures an auto driver or grandmother can report a pothole in 30 seconds without feeling confused.", body_style)
        ],
        [
            Paragraph("<b>Python</b><br/><font size=7 color='#7C3AED'>Automation & Data Scripts</font>", body_style),
            Paragraph("• Used for backend automation, hackathon PDF guide generation (`reportlab`), data analysis scripts, and AI data processing utilities.", body_style),
            Paragraph("• <b>Why:</b> Python is fast, has rich data processing libraries, and is the industry gold standard for generating PDF reports, automated tests, and handling AI pipelines.", body_style)
        ],
        [
            Paragraph("<b>Browser Web Speech API</b><br/><font size=7 color='#0284C7'>Voice Recognition</font>", body_style),
            Paragraph("• Powers the voice microphone in the complaint form (supporting English, Telugu, Kannada, Hindi, Tamil, etc.).", body_style),
            Paragraph("• <b>Why:</b> Runs directly inside the user's browser without requiring heavy external software or paid subscriptions, giving instant speech-to-text with zero lag.", body_style)
        ],
        [
            Paragraph("<b>OpenStreetMap & Leaflet</b><br/><font size=7 color='#EA580C'>Interactive Map</font>", body_style),
            Paragraph("• Interactive map picker where citizens can click on the road or tap 'Use Current Location'.", body_style),
            Paragraph("• <b>Why:</b> It is open-source, fast, lightweight, and lets citizens visually confirm where the issue is without needing expensive Google Maps API keys.", body_style)
        ],
        [
            Paragraph("<b>JSON Database Architecture</b><br/><font size=7 color='#475569'>Data Storage</font>", body_style),
            Paragraph("• Stores all registered citizens, admin logins, submitted complaints, photos, and live status timelines in `data/civicsense.json`.", body_style),
            Paragraph("• <b>Why:</b> Lightweight, structured, fast to read and write, and easy to export directly into Excel/CSV for municipal commissioner reports.", body_style)
        ]
    ]

    t_tech = Table(tech_table_data, colWidths=[110, 190, 220])
    t_tech.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F1F5F9")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(t_tech)
    elements.append(Spacer(1, 8))

    # What about Java, C, and C++?
    java_box = (
        "<b>Important: What about Java, C, and C++? (If judges ask: 'Why didn't you use Java or C++?')</b><br/>"
        "• <b>Answer to give:</b> <i>'Java and C/C++ are typically used for low-level system programming, operating systems, or heavy desktop software. "
        "For modern web applications that must run instantly on every citizen's mobile phone browser without downloading an app, "
        "JavaScript/TypeScript and Python are the global industry standard. "
        "However, in our future Phase 2 hardware rollout, we will use C/C++ for IoT sensors inside smart garbage bins and Java for our Android native mobile app.'</i>"
    )
    elements.append(Table([[Paragraph(java_box, body_style)]], colWidths=[520], style=[
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FEF3C7")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#F59E0B")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))

    # ================= 2. HOW THE SYSTEM WORKS (STEP-BY-STEP) =================
    elements.append(PageBreak())
    elements.append(Paragraph("2. How Civic Sense Works (Step-by-Step Flow)", h1_style))
    elements.append(Paragraph("Explain the simple journey of a complaint from citizen to resolution:", body_style))
    elements.append(Spacer(1, 3))

    steps_data = [
        ("Step 1: Citizen Reports Problem", "Citizen opens website, clicks microphone, and speaks in English or any Indian language (Telugu, Kannada, Hindi). They can also type manually."),
        ("Step 2: Location Captured", "They click 'Use Current Location' or click on the map. The system automatically converts GPS coordinates into a readable street name."),
        ("Step 3: Citizen Adds Photo/Video", "Citizen uploads photo or video of the broken road or garbage dump as physical proof."),
        ("Step 4: AI Brain Processes Ticket", "AI automatically assigns the department (Roads, Water, Waste), calculates severity (High/Medium/Low), and merges duplicate reports into 1 Incident ID (e.g. PTH-1042)."),
        ("Step 5: Admin Portal Live Notification", "Municipal admin sees the new issue appear on their live dashboard within 3 seconds without refreshing. Admin assigns a field officer."),
        ("Step 6: Officer Proof Upload (Mandatory)", "Officer repairs the problem and MUST upload a photo/video of the completed repair. Status cannot be marked 'Resolved' without proof!"),
        ("Step 7: Citizen Verification & Excel Export", "Citizen sees the repair photo on their timeline. Admin can click 'Download Excel' to get a complete spreadsheet report for government meetings.")
    ]
    for s_title, s_desc in steps_data:
        elements.append(Paragraph(f"• <b>{s_title}:</b> {s_desc}", bullet_style))
    elements.append(Spacer(1, 8))

    # ================= 3. 4-MEMBER TEAM ROLES =================
    elements.append(Paragraph("3. 4-Member Team Pitch Plan (Who Speaks What in 5 Minutes)", h1_style))
    elements.append(Paragraph("Here is how your 4 team members should divide the talking so everyone looks smart and coordinated:", body_style))
    elements.append(Spacer(1, 3))

    team_data = [
        [
            Paragraph("<b>MEMBER 1</b><br/><font size=7 color='#1E3A8A'>Team Lead / Problem Statement</font><br/><font size=7 color='#64748B'>Time: 0:00 - 1:15</font>", header_cell_style),
            Paragraph("<b>What to say:</b><br/>"
                      "1. Introduce the team and project name: <i>Civic Sense</i>.<br/>"
                      "2. <b>The Problem in India:</b> <i>'When we see a dangerous pothole or water leak, calling municipal helplines is frustrating. Complaints get lost, there is no proof of repair, and officials receive hundreds of duplicate complaints for the same road.'</i><br/>"
                      "3. <b>The Solution:</b> <i>'Civic Sense solves this with AI triage, voice typing in regional languages, duplicate clustering, and mandatory visual repair proof.'</i>", body_style)
        ],
        [
            Paragraph("<b>MEMBER 2</b><br/><font size=7 color='#0284C7'>UI/UX & Citizen Experience</font><br/><font size=7 color='#64748B'>Time: 1:15 - 2:30</font>", header_cell_style),
            Paragraph("<b>What to say (Live Demo on screen):</b><br/>"
                      "1. Open the <b>Report Problem</b> page.<br/>"
                      "2. Click the <b>Microphone</b>: Show how speaking in English or Telugu/Hindi transcribes text with live waveforms.<br/>"
                      "3. Show the <b>Interactive Map</b>: Click on a location to show how human-readable street names are selected.<br/>"
                      "4. Show the <b>Photo/Video upload</b> box with drag-and-drop preview.<br/>"
                      "5. <b>UI/UX Principle:</b> Explain that the design is simple enough for any citizen to report an issue in under 30 seconds.", body_style)
        ],
        [
            Paragraph("<b>MEMBER 3</b><br/><font size=7 color='#7C3AED'>Technology, Code & AI Lead</font><br/><font size=7 color='#64748B'>Time: 2:30 - 3:45</font>", header_cell_style),
            Paragraph("<b>What to say:</b><br/>"
                      "1. <b>Languages Used:</b> Explain that <b>TypeScript and JavaScript</b> power the entire interactive frontend and backend APIs, while <b>Python</b> handles automated data scripts and PDF report generation.<br/>"
                      "2. <b>AI Triage:</b> Explain how AI reads the problem, detects urgency, and translates regional voice into standard English for engineers.<br/>"
                      "3. <b>Duplicate Clustering (Big Feature):</b> Explain how if 20 citizens report the same broken pipe, the system links them to one Incident ID (PTH-1042) to save government time.", body_style)
        ],
        [
            Paragraph("<b>MEMBER 4</b><br/><font size=7 color='#059669'>Admin Operations & Impact</font><br/><font size=7 color='#64748B'>Time: 3:45 - 5:00</font>", header_cell_style),
            Paragraph("<b>What to say (Live Demo on Admin page):</b><br/>"
                      "1. Open the <b>Admin Portal</b> (`/admin` and `/admin/complaints`).<br/>"
                      "2. <b>Live Auto-Sync:</b> Show that complaints update automatically every 3 seconds without refreshing.<br/>"
                      "3. <b>Bi-Directional Proof (Killer Feature):</b> Show how an officer uploads photo or video proof of ongoing or finished work before closing the ticket.<br/>"
                      "4. <b>Download Excel:</b> Click <b>'Download Excel'</b> to show instant spreadsheet export for government reviews.<br/>"
                      "5. Conclude with a strong closing sentence thanking the judges.", body_style)
        ]
    ]

    t_team = Table(team_data, colWidths=[120, 400])
    t_team.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,-1), colors.HexColor("#F8FAFC")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(t_team)
    elements.append(Spacer(1, 8))

    # ================= 4. JUDGES QUESTIONS & SIMPLE ANSWERS =================
    elements.append(PageBreak())
    elements.append(Paragraph("4. Top Questions Judges Can Ask & What You Should Say", h1_style))
    elements.append(Paragraph("These are the most common questions judges ask in hackathons. Memorize these simple answers:", body_style))
    elements.append(Spacer(1, 3))

    qa_list = [
        ("Q1: What programming languages did you use to build this?",
         "<b>Say this:</b> <i>'We primarily used TypeScript and JavaScript for both the frontend website and backend APIs, HTML5 and CSS3 for structure and responsive styling, and Python for data automation and PDF reporting. We also utilized browser-native Web Speech APIs for regional voice typing.'</i>"),

        ("Q2: Why did you use TypeScript / JavaScript instead of Java or C++?",
         "<b>Say this:</b> <i>'JavaScript and TypeScript are the native languages of the web. They run instantly in any mobile phone browser without requiring citizens to install an app. While C++ and Java are great for low-level systems, TypeScript allows us to build a fullstack real-time platform with 100% type safety. In Phase 2, we will use C++ for IoT hardware sensors in smart garbage bins.'</i>"),

        ("Q3: Where and why did you use Python in this project?",
         "<b>Say this:</b> <i>'Python is used for backend data utilities, automation scripts, and generating downloadable PDF analytics and reports using ReportLab. Python's simplicity and rich libraries make it ideal for data processing and AI pipelines.'</i>"),

        ("Q4: How does your UI/UX help citizens who are not tech-savvy or cannot type in English?",
         "<b>Say this:</b> <i>'We designed the UI with 3 accessibility pillars: First, citizens do not need to type; they tap the microphone and speak in their mother tongue (Telugu, Hindi, Kannada, English). Second, they do not need to enter GPS coordinates; they tap 'Use Current Location'. Third, we use a 4-step clean wizard so users never see a long, intimidating form.'</i>"),

        ("Q5: How do you prevent duplicate complaints for the exact same road or garbage dump?",
         "<b>Say this:</b> <i>'We built an Incident Clustering Engine. If 10 citizens report the same pothole on MG Road, our algorithm groups them under one master Incident ID (e.g., PTH-1042). When the road is repaired, all 10 citizens receive updates simultaneously. This saves municipal officers from creating duplicate work orders.'</i>"),

        ("Q6: How do you ensure the municipal officer actually resolved the problem in reality?",
         "<b>Say this:</b> <i>'Bi-Directional Visual Proof. A municipal officer cannot mark a ticket as 'Resolved' just by clicking a button. The system requires the officer to upload photographic or video proof of the completed work. This photo is published to the citizen's live tracking timeline for public transparency.'</i>"),

        ("Q7: How does the admin dashboard stay updated without refreshing?",
         "<b>Say this:</b> <i>'Our Admin portal has a 3-second live auto-sync polling engine. As soon as a citizen submits a complaint on their mobile phone, the admin's screen updates immediately with a notification banner, placing the newest complaint at the very top.'</i>"),

        ("Q8: Can the government official export reports for weekly meetings?",
         "<b>Say this:</b> <i>'Yes! In the Admin complaints table, there is a one-click 'Download Excel' button. It instantly generates a clean CSV/Excel file containing Citizen Name, Phone, Issue Category, Location, Status, and Timestamps for government review meetings.'</i>")
    ]

    for q, a in qa_list:
        elements.append(KeepTogether([
            Paragraph(q, q_style),
            Paragraph(a, a_style),
            Spacer(1, 2)
        ]))

    # ================= 5. QUICK 60-SECOND OPENING PITCH =================
    elements.append(Spacer(1, 6))
    pitch_text = (
        "<b>60-Second Team Opening Pitch (Memorize this for the start of your demo):</b><br/>"
        "<i>\"Respected judges, every day thousands of civic issues—from open manholes to garbage heaps—go unresolved because existing municipal apps are slow, text-heavy, and opaque. "
        "We built Civic Sense, a smart civic operations platform where citizens simply speak their problem in their own language or take a photo. "
        "Our AI classifies the problem, merges duplicate reports, and routes it to the right department. "
        "Most importantly, municipal officers must upload photo evidence of the repair before closing the ticket. "
        "Civic Sense brings complete transparency, speed, and accountability to municipal governance. Let us show you a live demo!\"</i>"
    )
    elements.append(Table([[Paragraph(pitch_text, body_style)]], colWidths=[520], style=[
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F0FDF4")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#4ADE80")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))

    doc.build(elements, canvasmaker=NumberedCanvas)
    print(f"PDF successfully updated at: {filename}")

if __name__ == "__main__":
    out_file = os.path.join(r"c:\Users\panch\Downloads\Civic Sense", "Civic_Sense_Hackathon_Guide.pdf")
    build_pdf(out_file)
