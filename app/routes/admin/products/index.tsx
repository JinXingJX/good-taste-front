import { useState, useEffect } from 'react';
import { json, useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { Link } from '@remix-run/react';

// 服务器端数据加载
export async function loader() {
  try {
    // 在实际应用中，这里会调用 API 获取数据
    // 由于这是示例代码，我们返回模拟数据
    return json({
      products: [
        {
          id: 1,
          name_zh: '产品一',
          name_en: 'Product One',
          category_id: 1,
          category_name_zh: '分类一',
          category_name_en: 'Category One',
          featured: true,
          image_url: '/images/product1.jpg',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          name_zh: '产品二',
          name_en: 'Product Two',
          category_id: 1,
          category_name_zh: '分类一',
          category_name_en: 'Category One',
          featured: false,
          image_url: '/images/product2.jpg',
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          name_zh: '产品三',
          name_en: 'Product Three',
          category_id: 2,
          category_name_zh: '分类二',
          category_name_en: 'Category Two',
          featured: true,
          image_url: '/images/product3.jpg',
          created_at: new Date().toISOString()
        }
      ],
      categories: [
        { id: 1, name_zh: '分类一', name_en: 'Category One' },
        { id: 2, name_zh: '分类二', name_en: 'Category Two' }
      ]
    });
  } catch (error) {
    console.error('Error loading products:', error);
    return json({ products: [], categories: [] });
  }
}

export default function AdminProducts() {
  const { products, categories } = useLoaderData();
  const { t } = useTranslation(['admin', 'common']);
  const [currentLanguage, setCurrentLanguage] = useState('zh');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  // 筛选产品
  useEffect(() => {
    let result = [...products];
    
    // 按分类筛选
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category_id.toString() === selectedCategory);
    }
    
    // 按搜索词筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => {
        return (
          product.name_zh.toLowerCase().includes(query) ||
          product.name_en.toLowerCase().includes(query)
        );
      });
    }
    
    setFilteredProducts(result);
  }, [products, selectedCategory, searchQuery]);
  
  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };
  
  // 删除产品
  const handleDelete = async (id) => {
    if (confirmDelete !== id) {
      // 第一次点击，显示确认
      setConfirmDelete(id);
      return;
    }
    
    try {
      // 在实际应用中，这里会调用 API 删除产品
      console.log('Deleting product:', id);
      
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 更新状态（实际应用中应该重新获取数据）
      const updatedProducts = products.filter(product => product.id !== id);
      setFilteredProducts(updatedProducts);
      
      // 重置确认状态
      setConfirmDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(t('admin:products.deleteError'));
    }
  };
  
  // 取消删除确认
  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };
  
  return (
    <div className="admin-products">
      <div className="header">
        <h1>{t('admin:products.title')}</h1>
        <Link to="new" className="button">Add New Product</Link>
      </div>
      
      <div className="products-list">
        {/* TODO: Add actual products data and mapping */}
        <p>No products found. Add your first product to get started.</p>
      </div>
    </div>
  );
}