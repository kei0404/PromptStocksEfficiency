import WidgetKit
import SwiftUI

struct PromptStocksWidget: Widget {
    let kind: String = "PromptStocksWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            PromptStocksWidgetView(entry: entry)
        }
        .configurationDisplayName("PromptStocks")
        .description("AIプロンプトのクイックアクセス")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), prompts: PromptData.samplePrompts)
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date(), prompts: PromptData.samplePrompts)
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        // Load prompts from shared storage
        let prompts = PromptData.loadPrompts()
        let entry = SimpleEntry(date: Date(), prompts: prompts)
        
        // Update timeline every hour
        let nextUpdate = Calendar.current.date(byAdding: .hour, value: 1, to: Date())!
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        completion(timeline)
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let prompts: [PromptItem]
}

struct PromptItem {
    let id: String
    let title: String
    let category: String
    let categoryColor: String
    let content: String
}

struct PromptData {
    static let samplePrompts = [
        PromptItem(id: "1", title: "プロジェクト管理", category: "効率化", categoryColor: "1DB584", content: "プロジェクトの進行管理..."),
        PromptItem(id: "2", title: "ブログ記事作成", category: "文章", categoryColor: "3B82F6", content: "SEO最適化されたブログ記事..."),
        PromptItem(id: "3", title: "データ分析", category: "分析", categoryColor: "8B5CF6", content: "データの傾向と洞察..."),
        PromptItem(id: "4", title: "メール作成", category: "連絡", categoryColor: "EC4899", content: "プロフェッショナルなメール...")
    ]
    
    static func loadPrompts() -> [PromptItem] {
        // Load from shared app group storage
        guard let userDefaults = UserDefaults(suiteName: "group.com.promptstocks.shared") else {
            return samplePrompts
        }
        
        // For now, return sample data
        // In production, this would load from the shared storage
        return samplePrompts
    }
}

struct PromptStocksWidgetView: View {
    var entry: Provider.Entry
    
    var body: some View {
        GeometryReader { geometry in
            ZStack {
                // Background gradient
                LinearGradient(
                    gradient: Gradient(colors: [
                        Color(hex: "667eea"),
                        Color(hex: "764ba2")
                    ]),
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()
                
                VStack(spacing: 0) {
                    // Header
                    HStack {
                        HStack(spacing: 8) {
                            Image(systemName: "doc.text.fill")
                                .foregroundColor(.white)
                                .font(.system(size: 16, weight: .semibold))
                            Text("PromptStocks")
                                .foregroundColor(.white)
                                .font(.system(size: 14, weight: .semibold))
                        }
                        
                        Spacer()
                        
                        Text("\(entry.prompts.count)")
                            .foregroundColor(.white.opacity(0.8))
                            .font(.system(size: 12, weight: .medium))
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 12)
                    
                    // Category tabs (for medium/large widgets)
                    if geometry.size.width > 150 {
                        HStack(spacing: 8) {
                            CategoryTab(title: "効率化", isActive: true)
                            CategoryTab(title: "文章", isActive: false)
                            CategoryTab(title: "分析", isActive: false)
                            Spacer()
                        }
                        .padding(.horizontal, 16)
                        .padding(.top, 8)
                    }
                    
                    // Prompts list
                    VStack(spacing: 6) {
                        ForEach(Array(entry.prompts.prefix(geometry.size.height > 200 ? 4 : 3).enumerated()), id: \.element.id) { index, prompt in
                            PromptRow(prompt: prompt)
                                .animation(.easeInOut(duration: 0.3).delay(Double(index) * 0.1), value: entry.date)
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                    
                    Spacer()
                    
                    // Footer
                    if geometry.size.height > 200 {
                        HStack {
                            Spacer()
                            Button(action: {
                                // Open main app
                            }) {
                                HStack(spacing: 4) {
                                    Image(systemName: "arrow.up.right")
                                        .font(.system(size: 10, weight: .medium))
                                    Text("アプリを開く")
                                        .font(.system(size: 10, weight: .medium))
                                }
                                .foregroundColor(Color(hex: "1DB584"))
                            }
                        }
                        .padding(.horizontal, 16)
                        .padding(.bottom, 12)
                    }
                }
            }
        }
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }
}

struct CategoryTab: View {
    let title: String
    let isActive: Bool
    
    var body: some View {
        Text(title)
            .font(.system(size: 12, weight: .medium))
            .foregroundColor(isActive ? .white : .white.opacity(0.7))
            .padding(.horizontal, 12)
            .padding(.vertical, 4)
            .background(
                RoundedRectangle(cornerRadius: 8)
                    .fill(isActive ? Color(hex: "1DB584") : Color.clear)
            )
    }
}

struct PromptRow: View {
    let prompt: PromptItem
    
    var body: some View {
        HStack(spacing: 12) {
            Text(prompt.title)
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(.white)
                .lineLimit(1)
            
            Spacer()
            
            Button(action: {
                // Copy prompt to clipboard
                copyPromptToClipboard()
            }) {
                Image(systemName: "doc.on.doc")
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(.white.opacity(0.8))
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(
            RoundedRectangle(cornerRadius: 8)
                .fill(Color.white.opacity(0.15))
        )
    }
    
    private func copyPromptToClipboard() {
        UIPasteboard.general.string = prompt.content
        // Could show haptic feedback here
    }
}

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }

        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue:  Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

@main
struct PromptStocksWidgetBundle: WidgetBundle {
    var body: some Widget {
        PromptStocksWidget()
    }
}