import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../utils/theme';
import { CATEGORIES } from '../data/mockData';
import { TransactionType } from '../types';

interface Props {
  onClose: () => void;
  onSave: () => void;
}

export default function AddTransactionScreen({ onClose, onSave }: Props) {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);
  const [note, setNote] = useState('');
  const [account, setAccount] = useState('cash');
  const [date, setDate] = useState('Hôm nay');

  const displayAmount = amount
    ? parseInt(amount).toLocaleString('vi-VN')
    : '0';

  const handleNum = (n: string) => {
    if (n === '⌫') {
      setAmount(a => a.slice(0, -1));
    } else {
      setAmount(a => a + n);
    }
  };

  const numpad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thêm Giao dịch</Text>
        <TouchableOpacity style={styles.historyBtn}>
          <Text>🕐</Text>
        </TouchableOpacity>
      </View>

      {/* Type Toggle */}
      <View style={styles.typeRow}>
        {(['expense', 'income'] as TransactionType[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.typeBtn, type === t && styles.typeBtnActive]}
            onPress={() => setType(t)}
          >
            <Text style={[styles.typeBtnText, type === t && styles.typeBtnTextActive]}>
              {t === 'expense' ? 'Chi phí' : 'Thu nhập'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Amount Display */}
      <View style={styles.amountDisplay}>
        <Text style={styles.currency}>$</Text>
        <Text style={styles.amountText}>{displayAmount || '0'}.00</Text>
      </View>

      {/* Category & Account */}
      <View style={styles.rowFields}>
        <View style={styles.fieldItem}>
          <Text style={styles.fieldLabel}>Chọn hạng mục</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.catRow}>
              {CATEGORIES.slice(0, type === 'income' ? 2 : 6).map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.catChip, selectedCategory === cat.id && styles.catChipActive]}
                  onPress={() => setSelectedCategory(cat.id)}
                >
                  <Text style={styles.catEmoji}>{cat.icon}</Text>
                  <Text style={[styles.catLabel, selectedCategory === cat.id && { color: Colors.primary }]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Ngày</Text>
            <Text style={styles.metaValue}>{date}</Text>
          </View>
          <View style={[styles.metaItem, { borderLeftWidth: 1, borderColor: Colors.border }]}>
            <Text style={styles.metaLabel}>Tài khoản</Text>
            <Text style={styles.metaValue}>Ngân hàng cá nhân</Text>
          </View>
        </View>
      </View>

      {/* Numpad */}
      <View style={styles.numpad}>
        {numpad.map((n) => (
          <TouchableOpacity key={n} style={styles.numKey} onPress={() => handleNum(n)} activeOpacity={0.7}>
            <Text style={[styles.numKeyText, n === '⌫' && { fontSize: 20 }]}>{n}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Save */}
      <TouchableOpacity style={styles.saveBtn} onPress={onSave} activeOpacity={0.85}>
        <Text style={styles.saveBtnText}>Lưu Giao dịch 🔒</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 54,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  closeBtn: {
    width: 36, height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: { fontSize: 16, color: Colors.text },
  headerTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text },
  historyBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },

  typeRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.surfaceGray,
    borderRadius: Radius.full,
    padding: 3,
    marginBottom: Spacing.md,
  },
  typeBtn: { flex: 1, paddingVertical: 10, borderRadius: Radius.full, alignItems: 'center' },
  typeBtnActive: { backgroundColor: '#fff', ...Shadow.sm },
  typeBtnText: { fontSize: FontSize.base, color: Colors.textSecondary, fontWeight: '600' },
  typeBtnTextActive: { color: Colors.primary },

  amountDisplay: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
  },
  currency: { fontSize: FontSize.xxl, color: Colors.textSecondary, marginBottom: 6, marginRight: 4 },
  amountText: { fontSize: 52, fontWeight: '800', color: Colors.text, letterSpacing: -2 },

  rowFields: { paddingHorizontal: Spacing.lg },
  fieldItem: { marginBottom: Spacing.md },
  fieldLabel: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: 8, fontWeight: '500' },
  catRow: { flexDirection: 'row', gap: 8 },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceGray,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  catChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  catEmoji: { fontSize: 16 },
  catLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: '600' },

  metaRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceGray,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
  },
  metaItem: { flex: 1, padding: Spacing.sm },
  metaLabel: { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: 2 },
  metaValue: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text },

  numpad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  numKey: {
    width: '33.33%',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numKeyText: { fontSize: FontSize.xl, fontWeight: '500', color: Colors.text },

  saveBtn: {
    marginHorizontal: Spacing.lg,
    marginBottom: 32,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: '700' },
});
