#!/usr/bin/env python3
"""
Script để upload dữ liệu từ MOCKAPI_TEMPLATE.json lên MockAPI
Sử dụng: python upload_to_mockapi.py
"""

import json
import requests
import time
from typing import List, Dict

# 🔧 CẤU HÌNH - Thay đổi URL này bằng MockAPI endpoint của bạn
MOCKAPI_BASE_URL = "https://673e481ca9bc276ec4b7c8ea.mockapi.io/quiz"

def load_template_data(filename: str = "MOCKAPI_TEMPLATE.json") -> List[Dict]:
    """Đọc dữ liệu từ file template"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f"✅ Đã đọc {len(data)} câu hỏi từ {filename}")
        return data
    except FileNotFoundError:
        print(f"❌ Không tìm thấy file {filename}")
        return []
    except json.JSONDecodeError as e:
        print(f"❌ Lỗi parse JSON: {e}")
        return []

def upload_question(question: Dict) -> bool:
    """Upload một câu hỏi lên MockAPI"""
    try:
        response = requests.post(
            MOCKAPI_BASE_URL,
            json=question,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code in [200, 201]:
            print(f"✅ Đã upload Stage {question['stage']}, Câu {question['questionNumber']}")
            return True
        else:
            print(f"❌ Lỗi upload Stage {question['stage']}, Câu {question['questionNumber']}: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Lỗi kết nối: {e}")
        return False

def clear_all_data():
    """Xóa tất cả dữ liệu hiện tại (nếu cần)"""
    print("\n⚠️  Bạn có muốn xóa tất cả dữ liệu hiện tại không? (y/n): ", end="")
    confirm = input().strip().lower()
    
    if confirm != 'y':
        print("Bỏ qua việc xóa dữ liệu.")
        return
    
    try:
        # Lấy tất cả records hiện tại
        response = requests.get(MOCKAPI_BASE_URL)
        if response.status_code == 200:
            existing_data = response.json()
            print(f"Đang xóa {len(existing_data)} records hiện tại...")
            
            for item in existing_data:
                delete_response = requests.delete(f"{MOCKAPI_BASE_URL}/{item['id']}")
                if delete_response.status_code == 200:
                    print(f"✅ Đã xóa record ID: {item['id']}")
                else:
                    print(f"❌ Lỗi xóa record ID: {item['id']}")
                time.sleep(0.2)  # Tránh rate limit
                
            print("✅ Đã xóa tất cả dữ liệu cũ!")
        else:
            print(f"❌ Không thể lấy dữ liệu hiện tại: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Lỗi khi xóa dữ liệu: {e}")

def upload_all_questions(questions: List[Dict], delay: float = 0.3):
    """Upload tất cả câu hỏi với delay giữa các request"""
    total = len(questions)
    success_count = 0
    fail_count = 0
    
    print(f"\n🚀 Bắt đầu upload {total} câu hỏi...")
    print("=" * 60)
    
    for i, question in enumerate(questions, 1):
        print(f"\n[{i}/{total}] ", end="")
        
        if upload_question(question):
            success_count += 1
        else:
            fail_count += 1
        
        # Delay để tránh rate limit
        if i < total:
            time.sleep(delay)
    
    print("\n" + "=" * 60)
    print(f"\n📊 KẾT QUẢ:")
    print(f"   ✅ Thành công: {success_count}/{total}")
    print(f"   ❌ Thất bại: {fail_count}/{total}")
    print(f"   📈 Tỷ lệ thành công: {(success_count/total)*100:.1f}%")

def verify_upload():
    """Kiểm tra dữ liệu sau khi upload"""
    try:
        response = requests.get(MOCKAPI_BASE_URL)
        if response.status_code == 200:
            data = response.json()
            print(f"\n✅ Hiện có {len(data)} câu hỏi trên MockAPI")
            
            # Thống kê theo stage
            stage_count = {}
            for item in data:
                stage = item.get('stage', 'Unknown')
                stage_count[stage] = stage_count.get(stage, 0) + 1
            
            print("\n📊 Phân bổ theo Stage:")
            for stage in sorted(stage_count.keys()):
                print(f"   Stage {stage}: {stage_count[stage]} câu")
        else:
            print(f"❌ Không thể verify: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Lỗi khi verify: {e}")

def main():
    print("=" * 60)
    print("   🎯 MOCKAPI UPLOAD TOOL")
    print("=" * 60)
    print(f"\nEndpoint: {MOCKAPI_BASE_URL}\n")
    
    # Load data
    questions = load_template_data()
    if not questions:
        print("Không có dữ liệu để upload. Thoát...")
        return
    
    # Hiển thị thống kê
    stages = {}
    for q in questions:
        stage = q.get('stage', 'Unknown')
        stages[stage] = stages.get(stage, 0) + 1
    
    print("\n📋 Thống kê câu hỏi:")
    for stage in sorted(stages.keys()):
        print(f"   Stage {stage}: {stages[stage]} câu")
    print(f"   Tổng cộng: {len(questions)} câu")
    
    # Xác nhận
    print("\n⚠️  Bạn có muốn tiếp tục upload? (y/n): ", end="")
    confirm = input().strip().lower()
    
    if confirm != 'y':
        print("Đã hủy upload.")
        return
    
    # Tùy chọn xóa dữ liệu cũ
    clear_all_data()
    
    # Upload
    upload_all_questions(questions)
    
    # Verify
    print("\n🔍 Đang kiểm tra dữ liệu đã upload...")
    verify_upload()
    
    print("\n✨ Hoàn tất!")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Đã dừng bởi người dùng.")
    except Exception as e:
        print(f"\n❌ Lỗi không xác định: {e}")

